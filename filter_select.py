from grid_select import Grid

class FilterSelect:

    def __init__(self, effects_set):
        self.filters = ['chorus', 'delay', 'distortion', 'reverb', 'tremolo',
                        'vibrato', 'panner', 'wah']

        self.width = 4
        self.grid = Grid(self.filters, self.width)

        self.curr_effects_set = effects_set
        
    
    def filterMenu(self, direction, trigger):
        pass
        