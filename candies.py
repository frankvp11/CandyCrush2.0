import math
import pygame
import random
from collections import deque
import time
pygame.init()
screen_width = 1280
screen_height = 1280
screen = pygame.display.set_mode((screen_width, screen_height))

clock = pygame.time.Clock()
font = pygame.font.Font('freesansbold.ttf', 50)
white = (255, 255, 255)
green = (0, 255, 0)
blue = (0, 0, 128)
mapping = {1: '/home/frankvp11/CCWebsite/MyAttempt/candies/Blue.png',
           2: '/home/frankvp11/CCWebsite/MyAttempt/candies/Green.png',
           3:'/home/frankvp11/CCWebsite/MyAttempt/candies/Orange.png',
           4:'/home/frankvp11/CCWebsite/MyAttempt/candies/Purple.png',
           5:'/home/frankvp11/CCWebsite/MyAttempt/candies/Red.png',
           6:'/home/frankvp11/CCWebsite/MyAttempt/candies/Yellow.png',
           0: '/home/frankvp11/CCWebsite/MyAttempt/candies/BlueWrapped.png'}
prev_pos = None

running = True

score = 0
score_text = font.render("Score: {}".format(score), True, green)
score_rect = score_text.get_rect()
score_rect.center = (800, 100)
help_text = font.render("", True, green)
help_rect = help_text.get_rect()
help_rect.center = (800, 300)

class Candy:
    def __init__(self, image, pos, grid, index_1, index_2) -> None:
        self.x = pos[0]
        self.y = pos[1]
        self.image = pygame.image.load(image).convert()
        self.rect = self.image.get_rect(center=(self.x, self.y))
        self.dragging = False
        self.rel_pos = (0, 0)
        self.originalx = self.rect.x
        self.originaly = self.rect.y
        self.index_1 = index_1
        self.index_2 = index_2
        self.grid = grid
        self.visited = [[False for _ in range(len(self.grid[0]))] for _ in range(len(self.grid))]
        check = True
        while (check):
            again = self.checker()
            if (not again):
                check = False
                break

    def update(self, screen):
        screen.blit(self.image, self.rect)
        
    def move(self, event_list):
        for event in event_list:
            if event.type == pygame.MOUSEBUTTONDOWN:
                self.dragging = self.rect.collidepoint(event.pos)
                self.rel_pos = event.pos[0] - self.rect.x, event.pos[1] - self.rect.y
            if event.type == pygame.MOUSEBUTTONUP:
                self.rect.topleft = self.originalx, self.originaly
                self.dragging = False
            if event.type == pygame.MOUSEMOTION and self.dragging:
                ### The total movement in the x dir is bigger than y, so move in the x
                if (abs(self.originalx - event.pos[0]) > abs(self.originaly - event.pos[1])):
                    #shift the element to the right
                    if (self.originalx - (event.pos[0] - self.rel_pos[0]) < -100):
                        self.simulate_move(self.index_1, self.index_2, 'right')
                        #checks to see if the move going from right to left gives anything on the left side
                        self.simulate_move(self.index_1, self.index_2+1, 'left')
                        renew_grid(self.grid)
                    #shift the element to the left
                    elif (self.originalx- (event.pos[0] - self.rel_pos[0]) > 100):
                        self.rect.topleft = self.originalx-100, self.originaly
                        self.simulate_move(self.index_1, self.index_2, 'left')
                        #checks to see if the move going from left to right does anything on the right side
                        self.simulate_move(self.index_1, self.index_2-1, 'right')
                        renew_grid(self.grid)

                    else:
                        self.rect.topleft = event.pos[0] - self.rel_pos[0], self.originaly
                #otherwise we want to move in the y direction
                
                
                else:
                    #shift the element up
                    if (self.originaly- (event.pos[1] - self.rel_pos[1]) > 100):
                        self.rect.topleft = self.originalx, self.originaly-100
                        self.simulate_move(self.index_1, self.index_2, 'up')
                        #trying to see if moving the thing up does anything on the down side
                        self.simulate_move(self.index_1-1, self.index_2, 'down')
                        renew_grid(self.grid)
                    #shift the element down
                    elif (self.originaly - (event.pos[1] - self.rel_pos[1]) < -100):
                        self.rect.topleft = self.originalx, self.originaly+100
                        self.simulate_move(self.index_1, self.index_2, 'down')
                        self.simulate_move(self.index_1+1, self.index_2, 'up')
                        renew_grid(self.grid)
                        #just move it
                    else:
                        self.rect.topleft = self.originalx, (event.pos[1] - self.rel_pos[1])

    def is_valid(self, i, j, original_value):
        if (i >= 0 and i < len(self.grid) and j >= 0 and j < len(self.grid[i]) and self.grid[i][j] == original_value and not self.visited[i][j] and original_value != 0):
            return True
        else:
            return False

    def bfs(self, i, j, original_value):
        queue = deque([(i, j)])
        component_size = 1
        while (len(queue) != 0):
            r, c = queue.popleft()
            self.visited[r][c] = True
            for r_move, c_move in ((-1,0),(1,0),(0,1),(0,-1)):
                if (self.is_valid(r+r_move, c+c_move, original_value)):
                    component_size += 1
                    queue.append((r+r_move, c+c_move))
        return component_size
        
            
    def checker(self):
        didsmt = False
        for i in range(len(self.grid)):
            for j in range(len(self.grid[i])):
                if (not self.visited[i][j]):
                    size_of = self.bfs(i, j, self.grid[i][j])
                    if (size_of >= 3):
                        didsmt = True
                        self.customBFS(i, j, self.grid[i][j])
                        self.gravity()
        self.visited = [[False for _ in range(len(self.grid))] for _ in range(len(self.grid[0]))]
        return didsmt


    def swap(self, x1, y1, x2, y2):
        temp = self.grid[x1][y1]
        temp2 = self.grid[x2][y2]
        self.grid[x2][y2] = temp
        self.grid[x1][y1] = temp2

    def customBFS(self, i, j, original_value):
        self.visited = [[False for _ in range(len(self.grid))] for _ in range(len(self.grid[0]))]
        queue = deque([(i, j)])
        size = 1
        while (len(queue) != 0):
            r, c=  queue.popleft()
            self.visited[r][c] = True
            self.grid[r][c] = 0
            for r_move, c_move in ((-1,0),(1,0),(0,1),(0,-1)):
                if (self.is_valid(r+r_move, c+c_move, original_value)):
                    queue.append((r+r_move, c+c_move))
                    size += 1        
        self.visited = [[False for _ in range(len(self.grid))] for _ in range(len(self.grid[0]))]
        return size
    

    def printGrid(self):
        for x in self.grid:
            print(x)

    def simulate_move(self, i, j, direction):
        global score, score_text
        if (direction == 'right'):
            self.swap(i, j, i, j+1)
            if (self.isAcceptableMove(i, j+1)):
                size = self.customBFS(i, j+1, self.grid[i][j+1])
                score += (size*15)
                score_text = font.render("Score: {}".format(score), True, green)
                self.gravity()
            else:
                self.swap(i, j, i, j+1)

        elif (direction == 'left'):
            self.swap(i, j, i, j-1)
            if (self.isAcceptableMove(i, j-1)):
                size = self.customBFS(i, j-1, self.grid[i][j-1])
                score += (size* 15)
                score_text = font.render("Score: {}".format(score), True, green)
                self.gravity()
            else:
                self.swap(i, j, i, j-1)

        elif (direction == 'down'):
            self.swap(i, j, i+1, j)
            if (self.isAcceptableMove(i+1, j)):
                size = self.customBFS(i+1, j, self.grid[i+1][j])
                score += (size * 15)
                score_text = font.render("Score: {}".format(score), True, green)
                self.gravity()
            else:
                self.swap(i, j, i+1, j)
        elif (direction == 'up'):
            self.swap(i, j, i-1, j)
            if (self.isAcceptableMove(i-1, j)):
                size = self.customBFS(i-1, j, self.grid[i-1][j])
                score += (size * 15)
                
                self.gravity()
            else:
                self.swap(i, j, i-1, j)          

    def isAcceptableMove(self, i, j):
        return (self.bfs(i, j, self.grid[i][j]) > 2)

    def gravity(self):
        for i in range(len(self.grid[0])):
            counter = 0
            try:
                while True:
                    self.grid[i].remove(0)
                    counter+= 1
            except ValueError:
                while (counter != 0):
                    self.grid[i].insert(0,random.randint(1, 6))
                    counter -= 1
        renew_grid(self.grid)
        self.checker()


    def validateGrid(self):
        
        good = False
        for r_move, c_move in ((-1,0),(1,0),(0,1),(0,-1)):
            try:
                self.swap(self.index_1, self.index_2, self.index_1+r_move, self.index_2+c_move)
                if (self.bfs(self.index_1, self.index_2, self.grid[self.index_1][self.index_2]) >= 3):
                    good = True
                self.swap(self.index_1, self.index_2, self.index_1+r_move, self.index_2+c_move)
            except IndexError:
                continue
        if (good):
            return True
        else:
             return False

def create_grid():
    return [[random.randint(1, 6) for _ in range(5)] for i in range(5)]
grid = create_grid()

new_grid = [[None for _ in range(5)] for i in range(5)]
def renew_grid(grid):
    any = False
    for i in range(len(grid)):
        for j in range(len(grid[i])):
            new_grid[i][j] = Candy(mapping[grid[i][j]], (j*100+200, i*100+200), grid, i, j)
            if (new_grid[i][j].validateGrid()):
                any = True
    if (any):
        return
    else:
        print("Creating new grid!")
        grid2 = create_grid()
        renew_grid(grid2)

renew_grid(grid)

class Button():
	def __init__(self, image, pos, text_input, font, base_color, hovering_color):
		self.image = image
		self.x_pos = pos[0]
		self.y_pos = pos[1]
		self.font = font
		self.base_color, self.hovering_color = base_color, hovering_color
		self.text_input = text_input
		self.text = self.font.render(self.text_input, True, self.base_color)
		if self.image is None:
			self.image = self.text
		self.rect = self.image.get_rect(center=(self.x_pos, self.y_pos))
		self.text_rect = self.text.get_rect(center=(self.x_pos, self.y_pos))

	def update(self, screen):
		if self.image is not None:
			screen.blit(self.image, self.rect)
		screen.blit(self.text, self.text_rect)

	def checkForInput(self, position):
		if position[0] in range(self.rect.left, self.rect.right) and position[1] in range(self.rect.top, self.rect.bottom):
			return True
		return False

	def changeColor(self, position):
		if position[0] in range(self.rect.left, self.rect.right) and position[1] in range(self.rect.top, self.rect.bottom):
			self.text = self.font.render(self.text_input, True, self.hovering_color)
		else:
			self.text = self.font.render(self.text_input, True, self.base_color)


find_move = False
while running:
        screen.fill("black")
        help_button = Button(image=None, pos=(800, 200), text_input='help', font=font, base_color='white', hovering_color='green')

        screen.blit(score_text, score_rect)
        screen.blit(help_text, help_rect)
        mouse_pos = pygame.mouse.get_pos()
        help_button.changeColor(mouse_pos)
        help_button.update(screen)



        events_list = pygame.event.get()
        for event in events_list:
            if (event.type == pygame.QUIT):
                running = False 
            if (event.type == pygame.MOUSEBUTTONDOWN):
                if (help_button.checkForInput(mouse_pos)):
                    find_move = True
                    print("needs help finding move!")
        for i in range(len(new_grid)):
            for j in range(len(new_grid[i])):
                new_grid[i][j].update(screen)
                new_grid[i][j].move(events_list)
                if (find_move and new_grid[i][j].validateGrid()):
                    print("There is more at {}".format((i, j)))
                    help_text = font.render("There is a move at: {}".format(i+1, j+1), True, green)
                    screen.blit(help_text, help_rect)

                    find_move = False


                
        
        pygame.display.flip()
        pygame.display.update()

