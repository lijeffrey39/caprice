
from phone_controller import PhoneController
from grid_select import Grid

class ScaleSelect:
    def __init__(self, phone):
        self.pc = phone
        self.width = 6
        self.grid = Grid(self.pc.keys, self.width)
        self.currKey = 'C'


    # changes the state of the key in backend, still need to 
    # communicate with the phone outside of this class
    def instrumentNotification(self, direction, triggered):
        if (triggered):
            return (self.currKey, True, True)

        newX, newY = self.grid.moveValue(direction)
        oldKey = self.currKey
        if (self.grid.isValid(newX, newY)):
            # self.x, self.y = newX, newY
            self.grid.move(newX, newY)
            self.currKey = self.grid._grid[newY][newX]

        if (oldKey != self.currKey):
            return (self.currKey, False, True)
        else:
            return (self.currKey, False, False)
