import time

class SwipeDetector:
    def __init__(self):
        self.threshold = 100
        self.restraint = 100
        self.windowSize = 7
        self.xyArr = [(0, 0)] * self.windowSize
        self.count = 0
        self.direction = ""
        self.triggered = False

        self.actualPrevDirection = ""


    def newCalculateSwipe(self, curr, prev, direction):
        if (curr[0] == 0 or prev[0] == 0):
            return
        distX = curr[0] - prev[0]
        distY = curr[1] - prev[1]
        if (abs(distX) >= self.threshold and abs(distY) <= self.restraint):
            self.triggered = False
            direction[0] = 'left' if (distX < 0) else 'right'
        elif (abs(distY) >= self.threshold and abs(distX) <= self.restraint):
            self.triggered = False
            direction[0] = 'up' if (distY < 0) else 'down'
        self.direction = direction[0]
    
    def receiveData(self, allData):
        xAxis = allData['axisX']
        yAxis = allData['axisY']
        direction = ['none']
        prevDirection = self.direction
        pressed = False if (xAxis == 0) else True

        self.count += 1
        curr = (xAxis, yAxis)
        prev = self.xyArr[(self.count + 1) % self.windowSize]
        self.xyArr[self.count % self.windowSize] = curr
        self.newCalculateSwipe(curr, prev, direction)
        if (prevDirection == self.direction):
            direction[0] = 'none'
        
        if (self.actualPrevDirection == 'up' or self.actualPrevDirection == 'down'):
            if (pressed == False and self.triggered == False):
                self.triggered = True
                return ['off']


        if (direction[0] != 'none'):
            self.actualPrevDirection = direction[0]
        return direction