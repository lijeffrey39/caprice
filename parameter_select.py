from grid_select import Grid


class ParameterSelect:
    def __init__(self):
        # params have units, stored val is the max, normal means 0-1
        self.effectParams = {
            'chorus': {
                'frequency': 50,  # Hz,
                'delay': 1000,  # ms,
                'depth': 1,  # normal
                'wet': 1,  # normal
            },
            'delay': {
                'delay': 5,  # s
                'feedback': 1,  # normal
                'wet': 1,  # normal
            },
            'distortion': {
                'distortion': 1,  # normal
                'wet': 1,  # normal
            },
            'reverb': {
                'decay': 10,  # s
                'wet': 1,  # normal
            },
            'tremolo': {
                'frequency': 50,  # Hz,
                'depth': 1,  # normal
                'wet': 1,  # normal
            },
            'vibrato': {
                'frequency': 50,  # Hz,
                'depth': 1,  # normal
                'wet': 1,  # normal
            },
            'panner': {
                'joe': 1
            },
            'wah': {
                'q': 1,  # normal
            }
        }
        self.effectValues = {
            'chorus': {
                'frequency': [0, 0],  # Hz,
                'delay': [0, 0],  # ms,
                'depth': [0, 0],  # normal
                'wet': [0, 0],  # normal
            },
            'delay': {
                'delay': [0, 0],  # s
                'feedback': [0, 0],  # normal
                'wet': [0, 0],  # normal
            },
            'distortion': {
                'distortion': [0, 0],  # normal
                'wet': [0, 0],  # normal
            },
            'reverb': {
                'decay': [0, 0],  # s
                'wet': [0, 0],  # normal
            },
            'tremolo': {
                'frequency': [0, 0],  # Hz,
                'depth': [0, 0],  # normal
                'wet': [0, 0],  # normal
            },
            'vibrato': {
                'frequency': [0, 0],  # Hz,
                'depth': [0, 0],  # normal
                'wet': [0, 0],  # normal
            },
            'panner': {
                'joe': [0, 0], #normal
            },
            'wah': {
                'q': [0, 0],  # normal
            }
        }
        self.width = 4
        self.grid = Grid(list(self.effectParams), self.width)

        self.grid_dict = {}
        for effect in self.effectParams:
            self.grid_dict[effect] = Grid(list(self.effectParams[effect]), 1)
        # the effect being hovered over
        # actual selected effect
        self.cur_effect = "chorus"
        self.cur_param = "frequency"
        self.swipeHeld = False
        self.tapHeld = False
        self.keepGoing = 0

    # (selected effect name, selected param name, {{effect param names: [percent of param,
    #                                              value of param]})

    # tapping moves effects, swiping left/right changes param value,
    # swiping up/down changes params
    def paramNotification(self, swipedirection, tapdirection):
        if (tapdirection != 'none' and tapdirection != 'off'):  # move effect
            newX, newY = self.grid.moveValue(tapdirection)

            if (self.grid.isValid(newX, newY, [])):
                # self.x, self.y = newX, newY
                self.grid.move(newX, newY)
                self.cur_effect = self.grid._grid[newY][newX]
                self.cur_param = list(self.effectValues[self.cur_effect])[0]
                print(self.cur_effect)

        elif swipedirection == 'up' or swipedirection == 'down':  # an effect is selected, nav params now

            grid = self.grid_dict[self.cur_effect]

            newX, newY = grid.moveValue(swipedirection)
            if (grid.isValid(newX, newY, [])):
                # self.x, self.y = newX, newY
                grid.move(newX, newY)
                self.cur_param = grid._grid[newY][newX]
                print(self.cur_param)

        else:  # param selected, editing param values now
            param_max = self.effectParams[self.cur_effect][self.cur_param]
            step = param_max / 300
            if (swipedirection == 'right'):
                self.keepGoing = 1
            elif (swipedirection == 'left'):
                self.keepGoing = -1
            elif (swipedirection == 'off'):
                self.keepGoing = 0

            if self.keepGoing != 0:
                self.effectValues[self.cur_effect][self.cur_param][1] += self.keepGoing * step

                if param_max < self.effectValues[self.cur_effect][self.cur_param][1]:
                    self.effectValues[self.cur_effect][self.cur_param][1] = param_max
                elif self.effectValues[self.cur_effect][self.cur_param][1] < 0:
                    self.effectValues[self.cur_effect][self.cur_param][1] = 0

                self.effectValues[self.cur_effect][self.cur_param][0] = self.effectValues[self.cur_effect][self.cur_param][1] / param_max

                # print(self.effectValues[self.cur_effect][self.cur_param])

        return [self.cur_effect, self.cur_param,
                self.effectValues[self.cur_effect]]
