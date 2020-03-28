import time

class SwipeDetector:
    def __init__(self):
        self.pressed = False
        self.startXY = (0, 0)
        self.prevXY = (0, 0)
        self.startTime = None
        self.allowedTime = 0.3
        self.threshold = 200
        self.restraint = 100


    def calculateSwipe(self, direction):
        distX = self.prevXY[0] - self.startXY[0]
        distY = self.prevXY[1] - self.startXY[1]
        timeDiff = time.time() - self.startTime
        if (timeDiff < self.allowedTime):
            if (abs(distX) >= self.threshold and abs(distY) <= self.restraint):
                direction[0] = 'left' if (distX < 0) else 'right'
            elif (abs(distY) >= self.threshold and abs(distX) <= self.restraint):
                direction[0] = 'up' if (distY < 0) else 'down'

    
    def receiveData(self, allData):
        xAxis = allData['axisX']
        yAxis = allData['axisY']
        direction = ['none']

        if (xAxis == 0 and yAxis == 0):
            if (self.pressed):
                self.calculateSwipe(direction)
            self.pressed = False
        else:
            if (self.pressed == False):
                self.startXY = (xAxis, yAxis)
                self.startTime = time.time()
            self.pressed = True
            self.prevXY = (xAxis, yAxis)
        return direction