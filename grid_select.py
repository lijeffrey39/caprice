import math

class Grid:
    def __init__(self, options, width):
        self.x = 0
        self.y = 0
        self.options = options
        self.width = width
        self.height = math.ceil(len(self.options)/self.width)
        self._grid = self.generateGrid()


    def generateGrid(self):
        resGrid = []
        for i in range(self.height):
            row = []
            for j in range(self.width):
                index = (i * self.width) + j
                if (index >= len(self.options)):
                    row.append('*')
                    continue
                instrument = self.options[index]
                row.append(instrument)
            resGrid.append(row)
        return resGrid

    def move(self, x, y):
        self.x = x
        self.y = y

    def moveValue(self, direction):
        tempX = self.x
        tempY = self.y
        if (direction == 'up'):
            tempY -= 1
        elif (direction == 'down'):
            tempY += 1
        elif (direction == 'right'):
            tempX += 1
        elif (direction == 'left'):
            tempX -= 1
        return (tempX, tempY)

    def isValid(self, newX, newY, toggled):

        if newX >= 0 and newX < self.width and newY >= 0 and newY < self.height:
            if self._grid[newY][newX] != '*':
                
                if self._grid[newY][newX] in toggled:
                    return 'skip'
                else:
                    return True
        
        return False
        # return newX >= 0 and newX < self.width and newY >= 0 and newY < self.height and self._grid[newY][newX] != '*'