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


class Candy:
    def __init__(self, image, pos, grid, index_1, index_2) -> None:
        self.x = pos[0]
        self.y = pos[1]
        self.image = pygame.image.load(image).convert()
        self.rect = self.image.get_rect(center=(self.x, self.y))
        self.drag = DragOperator(self, grid, index_1, index_2)
        
    def update(self, screen):
        screen.blit(self.image, self.rect)
        
    def checkForInput(self, event):
        if(self.rect.collidepoint(event.pos)):
            return True
        return False
    
    def move(self, direction):
        self.drag.update(direction)

class DragOperator:
    def __init__(self, sprite, grid, index_1, index_2):
        self.sprite = sprite
        self.dragging = False
        self.rel_pos = (0, 0)
        self.originalx = self.sprite.rect.x
        self.originaly = self.sprite.rect.y
        self.index_1 = index_1
        self.index_2 = index_2
        self.grid = grid
        self.checker = GridChecker(self.grid)
        check = True
        while (check):
            again = self.checker.checker()
            if (not again):
                check = False
                break

    def update(self, event_list):
        for event in event_list:
            if event.type == pygame.MOUSEBUTTONDOWN:
                self.dragging = self.sprite.rect.collidepoint(event.pos)
                self.rel_pos = event.pos[0] - self.sprite.rect.x, event.pos[1] - self.sprite.rect.y
            if event.type == pygame.MOUSEBUTTONUP:
                self.sprite.rect.topleft = self.originalx, self.originaly
                self.dragging = False
            if event.type == pygame.MOUSEMOTION and self.dragging:
                ### The total movement in the x dir is bigger than y, so move in the x
                if (abs(self.originalx - event.pos[0]) > abs(self.originaly - event.pos[1])):
                    #shift the element to the right
                    if (self.originalx - (event.pos[0] - self.rel_pos[0]) < -100):
                        self.checker.simulate_move(self.index_1, self.index_2, 'right')
                        #checks to see if the move going from right to left gives anything on the left side
                        self.checker.simulate_move(self.index_1, self.index_2+1, 'left')
                        renew_grid()
                    #shift the element to the left
                    elif (self.originalx- (event.pos[0] - self.rel_pos[0]) > 100):
                        self.sprite.rect.topleft = self.originalx-100, self.originaly
                        self.checker.simulate_move(self.index_1, self.index_2, 'left')
                        #checks to see if the move going from left to right does anything on the right side
                        self.checker.simulate_move(self.index_1, self.index_2-1, 'right')
                        renew_grid()

                    else:
                        self.sprite.rect.topleft = event.pos[0] - self.rel_pos[0], self.originaly
                #otherwise we want to move in the y direction
                
                
                else:
                    #shift the element up
                    if (self.originaly- (event.pos[1] - self.rel_pos[1]) > 100):
                        self.sprite.rect.topleft = self.originalx, self.originaly-100
                        self.checker.simulate_move(self.index_1, self.index_2, 'up')
                        #trying to see if moving the thing up does anything on the down side
                        self.checker.simulate_move(self.index_1-1, self.index_2, 'down')
                        renew_grid()
                    #shift the element down
                    elif (self.originaly - (event.pos[1] - self.rel_pos[1]) < -100):
                        self.sprite.rect.topleft = self.originalx, self.originaly+100
                        self.checker.simulate_move(self.index_1, self.index_2, 'down')
                        self.checker.simulate_move(self.index_1+1, self.index_2, 'up')
                        renew_grid()
                        #just move it
                    else:
                        self.sprite.rect.topleft = self.originalx, (event.pos[1] - self.rel_pos[1])


class GridChecker():
    def __init__(self, grid):
        self.grid = grid
        self.visited = [[False for _ in range(len(self.grid[0]))] for _ in range(len(self.grid))]
        self.validateGrid()
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
        renew_grid()
        self.checker()

    
 
            

    


def create_grid():
    return [[random.randint(1, 6) for _ in range(5)] for i in range(5)]
grid = create_grid()

new_grid = [[None for _ in range(5)] for i in range(5)]

def renew_grid():
    for i in range(len(grid)):
        for j in range(len(grid[i])):
            new_grid[i][j] = Candy(mapping[grid[i][j]], (j*100+200, i*100+200), grid, i, j)
renew_grid()



while running:
        screen.fill("black")
        screen.blit(score_text, score_rect)
        mouse_pos = pygame.mouse.get_pos()

        events_list = pygame.event.get()
        for event in events_list:
            if (event.type == pygame.QUIT):
                running = False 
        for i in range(len(new_grid)):
            for j in range(len(new_grid[i])):
                new_grid[i][j].update(screen)
                new_grid[i][j].move(events_list)
        
        pygame.display.flip()
        pygame.display.update()

