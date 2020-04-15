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

        self.press_direction = ""
        self.press_direction_prev = ""
        self.press_trigger = True


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
                return 'off'

        if (direction[0] != 'none'):
            self.actualPrevDirection = direction[0]
        return direction[0]

    def detect_direction_press(self, x, y, direction, touchpadButton):
        if (touchpadButton):
            # print(x, y)
            if (y > 100 and y < 200):
                if (x < 50):
                    self.press_trigger = False
                    direction[0] = 'left'
                if (x > 300):
                    self.press_trigger = False
                    direction[0] = 'right'
            if (x > 70 and x < 230):
                if (y < 50):
                    self.press_trigger = False
                    direction[0] = 'up'
                if (y > 290):
                    self.press_trigger = False
                    direction[0] = 'down'
            if (x > 100 and x < 200 and y > 100 and y < 200):
                self.press_trigger = False
                direction[0] = 'center'
            self.press_direction = direction[0]


    def detect_press(self, message):
        x = message['axisX']
        y = message['axisY']
        touchpadButton = message['touchpadButton']
        direction = ['none']
        prev_direction = self.press_direction
        self.detect_direction_press(x, y, direction, touchpadButton)
        if (prev_direction == self.press_direction):
            direction[0] = 'none'

        if (prev_direction == 'up' or prev_direction == 'down'):
            if (touchpadButton == False and self.press_trigger == False):
                self.press_trigger = True
                return 'off'

        # if (direction[0] != 'none'):
        # self.press_direction_prev = self.press_direction
        return direction[0]