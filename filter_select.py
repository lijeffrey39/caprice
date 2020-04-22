from grid_select import Grid

class FilterSelect:

    def __init__(self, effects_set):
        self.filters = ['chorus', 'delay', 'distortion', 'reverb', 'tremolo',
                        'vibrato', 'panner', 'wah']

        self.width = 4
        self.grid = Grid(self.filters, self.width)

        self.curr_effects_set = effects_set
        self.curr_edit_direction = ""
        self.curr_filter = ""
    
    def filterMenu(self, swipe_direction, tap_direction, trigger):
     
        # (direction, neweffect, changed, selected)

        if trigger:
            if self.curr_edit_direction != "" and self.curr_filter != self.curr_effects_set[self.curr_edit_direction]:
                self.curr_effects_set[self.curr_edit_direction] = self.curr_filter
                # print("SELECTED ", self.curr_filter)
                return (self.curr_edit_direction, self.curr_filter, True, True)

        if tap_direction != 'none' and tap_direction != 'off':
            self.curr_edit_direction = tap_direction
            self.curr_filter = self.curr_effects_set[tap_direction]
            print("FILTER SET MODE: Editing '%s'" %self.curr_edit_direction)
            return (self.curr_edit_direction, "", False, False)
        
        newX, newY = self.grid.moveValue(swipe_direction)
        prev_filter = self.curr_filter

        toggled_filter_list = list(self.curr_effects_set.values())

        if self.grid.isValid(newX, newY, toggled_filter_list) == True:
            self.grid.move(newX, newY)
            self.curr_filter = self.grid._grid[newY][newX]

        elif (self.grid.isValid(newX, newY, toggled_filter_list) == 'skip'):
            
            if swipe_direction == 'up':
                newY -= 1
            elif swipe_direction == 'down':
                newY += 1
            elif swipe_direction == 'right':
                newX += 1
            elif swipe_direction == 'left':
                newX -= 1

            if (self.grid.isValid(newX, newY, toggled_filter_list) == True):
                self.grid.move(newX, newY)
                self.curr_filter = self.grid._grid[newY][newX]
        
        if self.curr_filter != prev_filter:
            return (self.curr_edit_direction, self.curr_filter, True, False)
        else:
            return (self.curr_edit_direction, self.curr_filter, False, False)
        