
class PhoneController:
    def __init__(self):
        self.real_start = [60, 62, 64, 65, 67, 69, 71, 72]
        self.midi_start = [60, 62, 64, 65, 67, 69, 71, 72]
        self.phone_start = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Z']
        self.octave_number = 8
        self.midi_octave = 12
        self.current_midi_notes = []
        self.current_notes = []
        self.shift = 0
        self.start_notes = "C C#D D#E F F#G G#A A#B "

    def convert_midi(self, notes):
        res = []
        for midi_note in notes:
            octave = int(midi_note / self.midi_octave) - 1
            start_num = (midi_note % self.midi_octave) * 2
            note = self.start_notes[start_num: start_num + 2]
            res.append(note.strip() + str(octave))
        return res

    def swipeControl(self, dir):
        if (dir == 'none'):
            return
        print(dir)
        if (dir == 'up'):
            self.shift_up()
            self.set_shift(1)
        elif (dir == 'down'):
            self.shift_down()
            self.set_shift(-1)
        elif (dir == 'right'):
            self.increase_octave()
        elif (dir == 'left'):
            self.decrease_octave()
        elif (dir == 'center'):
            self.reset()
        elif (dir == 'off'):
            if (self.get_shift() == 1):
                self.shift_down()
            elif (self.get_shift() == -1):
                self.shift_up()
            self.set_shift(0)

    def reset(self):
        self.midi_start = self.real_start
        self.octave_number = 8
        self.current_notes = []
        self.current_midi_notes = []
        self.shift = 0

    def set_shift(self, shift):
        self.shift = shift
    
    def get_shift(self):
        return self.shift

    def shift_up(self):
        for i in range(len(self.midi_start)):
            self.midi_start[i] += 1

    def shift_down(self):
        for i in range(len(self.midi_start)):
            self.midi_start[i] -= 1

    def update_notes(self, buttons):
        res_notes = []
        for note in buttons:
            if (buttons[note]):
                index = self.phone_start.index(note)
                res_notes.append(self.midi_start[index])
        self.current_midi_notes = res_notes
        self.current_notes = self.convert_midi(res_notes)

    def increase_octave(self):
        if (self.octave_number % 2 == 0):
            for i in range(0, 4):
                self.midi_start[i] += self.midi_octave
        else:
            for i in range(4, 8):
                self.midi_start[i] += self.midi_octave
        self.octave_number += 1

    def decrease_octave(self):
        if (self.octave_number % 2 == 0):
            for i in range(4, 8):
                self.midi_start[i] -= self.midi_octave
        else:
            for i in range(0, 4):
                self.midi_start[i] -= self.midi_octave
        self.octave_number -= 1