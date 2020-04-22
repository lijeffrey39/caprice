import time
from grid_select import Grid

class InstrumentSelect:
    def __init__(self, toggled_instrument):
        self.instruments = ["Bass", "Bassoon", "Cello", "Clarinet", "Contrabass",
                            "Flute", "French Horn", "Acoustic Guitar", "Electric Guitar", "Classical Guitar",
                            "Harmonium", "Harp", "Organ", "Piano", "Saxophone", "Trombone", "Trumpet","Tuba",
                            "Violin", "Xylophone", "AMSynth", "FMSynth", "MembraneSynth","DuoSynth"]
        self.width = 6
        self.grid = Grid(self.instruments, self.width)
        self.currInstrument = ""
        self.prevTriggered = True
        self.toggledInstrument = toggled_instrument

    def instrumentNotification(self, direction, triggered):
        if (triggered and self.prevTriggered):
            self.prevTriggered = False
            self.toggledInstrument = self.currInstrument
        
            return (self.currInstrument, True, True)

        newX, newY = self.grid.moveValue(direction)
        newInstrument = self.currInstrument
        if (self.grid.isValid(newX, newY, []) == True):
            # self.x, self.y = newX, newY
            self.grid.move(newX, newY)
            self.currInstrument = self.grid._grid[newY][newX]
            
        elif (self.grid.isValid(newX, newY, []) == 'skip'):
            
            if direction == 'up':
                newY -= 1
            elif direction == 'down':
                newY += 1
            elif direction == 'right':
                newX += 1
            elif direction == 'left':
                newX -= 1

            if (self.grid.isValid(newX, newY, [])):
                self.grid.move(newX, newY)
                self.currInstrument = self.grid._grid[newY][newX]

        if (newInstrument != self.currInstrument):
            self.prevTriggered = True
            return (self.currInstrument, False, True)
        else:
            return (self.currInstrument, False, False)