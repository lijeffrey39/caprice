from grid_select import Grid


class KeySelect:
    def __init__(self):
        self.keys = {'C': 0,
                     'C#': 1,
                     'D': 2,
                     'D#': 3,
                     'E': 4,
                     'F': 5,
                     'F#': 6,
                     'G': 7,
                     'G#': 8,
                     'A': 9,
                     'A#': 10,
                     'B': 11
                     }
        self.modes = {
            # major modes
            'ionian': [0, 2, 4, 5, 7, 9, 11, 12],
            'lydian': [0, 2, 4, 6, 7, 9, 11, 12],
            'mixolydian': [0, 2, 4, 5, 7, 9, 10, 12],
            # ???
            'locrian': [0, 1, 3, 5, 6, 8, 10, 12],
            # minor modes
            'natural minor': [0, 2, 3, 5, 7, 8, 10, 12],
            'dorian': [0, 2, 3, 5, 7, 9, 10, 12],
            'phrygian': [0, 1, 3, 5, 7, 8, 10, 12]
        }
        self.keyWidth = 6
        self.modeWidth = 7

        self.keyGrid = Grid(list(self.keys), self.keyWidth)
        self.modeGrid = Grid(list(self.modes), self.modeWidth)

        self.selected_key = "C"
        self.selected_mode = "ionian"

        self.cur_key = "C"
        self.cur_mode = "ionian"

        self.whichGrid = "key"  # or mode

    def keyNotification(self, direction, triggered):
        if triggered:
            if self.whichGrid == 'key':
                self.selected_key = self.cur_key
            else:
                self.selected_mode = self.cur_mode

            return (self.cur_key, self.selected_key, self.cur_mode, self.selected_mode)

        if direction == 'none':
            return

        if self.whichGrid == 'key':
            newX, newY = self.keyGrid.moveValue(direction)
            if self.keyGrid.isValid(newX, newY, [self.selected_key]):
                self.keyGrid.move(newX, newY)
                self.cur_key = self.keyGrid._grid[newY][newX]
            elif newY >= self.keyGrid.height:  # switch to next grid
                self.whichGrid = 'mode'
        else:
            newX, newY = self.modeGrid.moveValue(direction)
            if self.modeGrid.isValid(newX, newY, [self.selected_mode]):
                self.modeGrid.move(newX, newY)
                self.cur_mode = self.modeGrid._grid[newY][newX]
            elif newY < 0:  # switch to next grid
                self.whichGrid = 'key'

        return (self.cur_key, self.selected_key, self.cur_mode, self.selected_mode)