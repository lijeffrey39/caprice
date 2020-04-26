
from flask_socketio import emit

modes = {
    #major modes
    'ionian': [0, 2, 4, 5, 7, 9, 11, 12],
    'lydian': [0, 2, 4, 6, 7, 9, 11, 12],
    'mixolydian': [0, 2, 4, 5, 7, 9, 10, 12],
    #???
    'locrian': [0, 1, 3, 5, 6, 8, 10, 12],
    #minor modes
    'aeolian': [0, 2, 3, 5, 7, 8, 10, 12],
    'dorian': [0, 2, 3, 5, 7, 9, 10, 12],
    'phrygian': [0, 1, 3, 5, 7, 8, 10, 12]
}

keys = {
    'C': 0,
    'C#': 1,
    'D': 2,
    'D#': 3,
    'E': 4,
    'F': 5,
    'F#': 6, 
    'G': 7,
    'G##': 8,
    'A': 9,
    'A#': 10,
    'B': 11
}

class PhoneController:
    def __init__(self):
        self.real_start = [60] #, 62, 64, 65, 67, 69, 71, 72]
        self.key = 'C'
        self.keys = keys
        self.midi_start = [60, 62, 64, 65, 67, 69, 71, 72]
        self.mode = 'ionian'
        self.modes = modes
        self.phone_start = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Z']
        self.octave_number = 8
        self.midi_octave = 12
        self.current_midi_notes = []
        self.current_notes = []
        self.shift = 0
        self.start_notes = "C C#D D#E F F#G G#A A#B "

    def convert_midi(self, notes, num):
        res = []
        for midi_note in notes:
            start_num = (midi_note % self.midi_octave) * 2
            note = self.start_notes[start_num: start_num + 2]
            if(num):
                octave = int(midi_note / self.midi_octave) - 1
                res.append(note.strip() + str(octave))
            else:
                res.append(note.strip())
        return res

    def change_mode(self, newMode):
        for i in range(len(modes[newMode])):
            self.midi_start[i] = self.midi_start[0] + modes[newMode][i]
        self.mode = newMode
        # self.phone_start = self.convert_midi(self.midi_start, False)

    def change_key(self, key):
        diff = self.key - keys[key]
        self.key = key
        self.real_start = self.real_start + diff

        for i in range(len(self.midi_start)):
            self.midi_start[i] = self.midi_start[i] + diff


    def swipeControl(self, dir):
        if (dir == 'none'):
            return
        if (dir == 'up'):
            self.shift_up()
            self.set_shift(1)
            emit('update notes', {'notes': self.current_notes}, broadcast=True)

        elif (dir == 'down'):
            self.shift_down()
            self.set_shift(-1)
            emit('update notes', {'notes': self.current_notes}, broadcast=True)

        elif (dir == 'right'):
            self.increase_octave()
        elif (dir == 'left'):
            self.decrease_octave()
        elif (dir == 'center'):
            self.reset()
        elif (dir == 'off'):
            if (self.get_shift() == 1):
                self.shift_down()
                emit('update notes', {'notes': self.current_notes}, broadcast=True)
            elif (self.get_shift() == -1):
                self.shift_up()
                emit('update notes', {'notes': self.current_notes}, broadcast=True)
            self.set_shift(0)

    def reset(self):
        self.midi_start[0] = self.real_start[0]
        self.change_mode(self.mode)
        self.octave_number = 8
        self.current_notes = ['Cb4']
        self.current_midi_notes = []
        self.shift = 0

    def set_shift(self, shift):
        self.shift = shift
    
    def get_shift(self):
        return self.shift

    def shift_up(self):
        for i in range(len(self.midi_start)):
            self.midi_start[i] += 1

        for i in range(len(self.current_midi_notes)):
            self.current_midi_notes[i] += 1

        self.current_notes = self.convert_midi(self.current_midi_notes, True)

    def shift_down(self):
        for i in range(len(self.midi_start)):
            self.midi_start[i] -= 1

        for i in range(len(self.current_midi_notes)):
            self.current_midi_notes[i] -= 1

        self.current_notes = self.convert_midi(self.current_midi_notes, True)

    def update_notes(self, buttons):
        res_notes = []
        for note in buttons:
            if (buttons[note]):
                index = self.phone_start.index(note)
                res_notes.append(self.midi_start[index])
        self.current_midi_notes = res_notes
        self.current_notes = self.convert_midi(res_notes, True)

    def increase_octave(self):
        if(self.octave_number < 12):
            if (self.octave_number % 2 == 0):
                for i in range(0, 4):
                    self.midi_start[i] += self.midi_octave
            else:
                for i in range(4, 8):
                    self.midi_start[i] += self.midi_octave
            self.octave_number += 1

    def decrease_octave(self):
        if(self.octave_number > 0):
            if (self.octave_number % 2 == 0):
                for i in range(4, 8):
                    self.midi_start[i] -= self.midi_octave
            else:
                for i in range(0, 4):
                    self.midi_start[i] -= self.midi_octave
            self.octave_number -= 1
