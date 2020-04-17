from grid_select import Grid

class FilterSelect:

    def __init__(self):
        self.filters = ['chorus', 'delay', 'distortion', 'reverb', 'tremolo',
                        'vibrato', 'panner', 'wah']

        self.width = 4
        self.grid = Grid(self.instruments, self.width)
        