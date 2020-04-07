import time

class SwipeDetector:
    def __init__(self):
        self.threshold = 200
        self.restraint = 100
        self.windowSize = 7
        self.xyArr = [(0, 0)] * self.windowSize
        self.count = 0
        self.direction = ""
        self.pressed = False

        self.actualPrevDirection = ""


    def newCalculateSwipe(self, curr, prev, direction):
        if (curr[0] == 0 or prev[0] == 0):
            return
        distX = curr[0] - prev[0]
        distY = curr[1] - prev[1]
        if (abs(distX) >= self.threshold and abs(distY) <= self.restraint):
            direction[0] = 'left' if (distX < 0) else 'right'
        elif (abs(distY) >= self.threshold and abs(distX) <= self.restraint):
            direction[0] = 'up' if (distY < 0) else 'down'
        self.direction = direction[0]
    
    def receiveData(self, allData):
        xAxis = allData['axisX']
        yAxis = allData['axisY']
        direction = ['none']
        prevDirection = self.direction
        if (xAxis == 0):
            self.pressed = False
        else:
            self.pressed = True

        self.count += 1
        curr = (xAxis, yAxis)
        prev = self.xyArr[(self.count + 1) % self.windowSize]
        self.xyArr[self.count % self.windowSize] = curr
        self.newCalculateSwipe(curr, prev, direction)
        if (prevDirection == self.direction):
            direction[0] = 'none'
        
        # if (self.actualPrevDirection == 'up'):

        
        self.actualPrevDirection = direction[0]
        return direction