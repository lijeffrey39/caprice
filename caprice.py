from gesture_detection import GestureDetector
from swipe_detection import SwipeDetector
from phone_controller import PhoneController
from gyro_velocity import GyroVelocity
from play_mode import PlayMode
from instrument_select import InstrumentSelect
from parameter_select import ParameterSelect
from filter_select import FilterSelect


class Caprice:

    def __init__(self):
        self.sd = SwipeDetector()
        self.gd = GestureDetector()
        self.parSel = ParameterSelect()
        
        self.play_mode = PlayMode()
        self.filter_select = FilterSelect(self.play_mode.effects_set)
        
        self.inSel = InstrumentSelect(self.play_mode.toggled_instrument)

        self.current_mode = "play"
        self.home_release = True
        self.back_release = True
        self.triggerHeld = False
        self.homeHeld = False
        self.backHeld = False

        self.edit_mode = ""


    def update_mode(self, home, back):
        if (home):
            if self.home_release:
                if self.current_mode == 'play':
                    self.current_mode = 'edit'
                else:
                    self.current_mode = 'play'
                self.home_release = False
        else:
            if not self.home_release:
                self.home_release = True
        
        if (back):
            if self.back_release:
                if (self.edit_mode != ""):
                    self.current_mode = 'edit'
                    self.edit_mode = ""
                self.back_release = False
        else:
            if not self.back_release:
                self.back_release = True


    def update_edit_mode(self, swipe_direction):
        if (swipe_direction == 'up'):
            self.edit_mode = 'filter set'
        elif (swipe_direction == 'right'):
            self.edit_mode = 'instrument select'
        elif (swipe_direction == 'left'):
            self.edit_mode = 'parameter set'
        elif (swipe_direction == 'down'):
            self.edit_mode = 'key set'


    def parse_notification(self,data):
        prev_mode = self.current_mode

        #trigger button logic, use trigselect for ur classes
        if (data['triggerButton'] and not self.triggerHeld):
            self.triggerHeld = True
            trigSelect = True
        else:
            if (data['triggerButton'] and self.triggerHeld):
                trigSelect = False
            else:
                self.triggerHeld = False
                trigSelect = False

        # update current mode (play, edit)
        self.update_mode(data['homeButton'], data['backButton'])
    
        # touchpad click direction
        tap_direction = self.sd.detect_press(data)

        # touchpad swipe direction
        swipe_direction = self.sd.receiveData(data)
        if swipe_direction != "none":
            print(swipe_direction)

        # update edit mode (instrument, filter, key, params)
        if self.edit_mode == "":
            self.update_edit_mode(swipe_direction)

        output = None
        if self.current_mode == 'play':
            output = self.play_mode.generate_message(swipe_direction, tap_direction, data)
        elif (self.edit_mode != ""):
            if (self.edit_mode == 'filter set'):
                (filter_dir, new_effect, changed, selected) = self.filter_select.filterMenu(swipe_direction, 
                                                                                        tap_direction,
                                                                                        trigSelect)
                if new_effect == "" and filter_dir != "":
                    output = {'toggle': filter_dir}
                
                if selected:
                    self.play_mode.effects_set[filter_dir] = new_effect
                
                if changed:
                    output = {'direction': filter_dir, 'effect': new_effect, 'selected': selected}
                    
            elif (self.edit_mode == 'instrument select'):
                (newIn, changeIn, changed) = self.inSel.instrumentNotification(swipe_direction, data['triggerButton'])
                output = {'instrument': newIn, 'change': changeIn}
                if (changed):
                    self.play_mode.toggled_instrument = newIn
            elif self.edit_mode == 'parameter set':
                output = self.parSel.paramNotification(swipe_direction, tap_direction)

        res = {
            'mode': self.current_mode,
            'editMode': self.edit_mode,
            'output': output,
            'modeChanged': self.current_mode != prev_mode
        }
        return res
