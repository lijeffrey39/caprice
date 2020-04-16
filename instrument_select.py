import time

class InstrumentSelect:
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