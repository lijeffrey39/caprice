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

       
    
    def parse_notification(self,data):

        trigSelect = None

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

        if (data['homeButton'] and not self.homeHeld):
            self.homeHeld = True
            homeSelect = True
        else:
            if (data['homeButton'] and self.homeHeld):
                homeSelect = False
            else:
                self.homeHeld = False
                homeSelect = False

        if (data['backButton'] and not self.backHeld):
            self.backHeld = True
            backSelect = True
        else:
            if (data['backButton'] and self.backHeld):
                backSelect = False
            else:
                self.backHeld = False
                backSelect = False

        if data['homeButton']:
            if self.home_release:
                if self.current_mode == 'play':
                    self.current_mode = 'edit'
                    print('EDIT MODE')
                else:
                    self.current_mode = 'play'
                    print('PLAY MODE')

                self.home_release = False
        else:
            if not self.home_release:
                self.home_release = True
        
        if data['backButton']:
            if self.back_release:
                if self.current_mode != 'play' and self.current_mode != 'edit':
                    self.current_mode = 'edit'
                    print('EDIT MODE')

                self.back_release = False
        else:
            if not self.back_release:
                self.back_release = True

        #touchpad click direction
        tap_direction = self.sd.detect_press(data)

        #touchpad swipe direction
        swipe_direction = self.sd.receiveData(data)
        
        if self.current_mode == 'play':
            message = self.play_mode.generate_message(swipe_direction,
                                                          tap_direction,
                                                          data)
            return ['play', message]
        
        elif self.current_mode == 'filter set':
            (filter_dir, new_effect, changed, selected) = self.filter_select.filterMenu(swipe_direction, 
                                                                                        tap_direction,
                                                                                        trigSelect)
            if new_effect == "" and filter_dir != "":
                res = {'toggle': filter_dir}
                return ['filter set', res]
            
            if selected:
                self.play_mode.effects_set[filter_dir] = new_effect
            
            if changed:
                res = {'direction': filter_dir, 'effect': new_effect, 'selected': selected}
                return ['filter set', res]

        elif self.current_mode == 'instrument select':
            (newIn, changeIn, changed) = self.inSel.instrumentNotification(swipe_direction, data['triggerButton'])
            if (changed):
                res = {'instrument': newIn, 'change': changeIn}
                self.play_mode.toggled_instrument = newIn
                return ['instrument select', res]
                
        elif self.current_mode == 'parameter set':
            output = self.parSel.paramNotification(swipe_direction, tap_direction)
            return ['param select', output]

        else:
            # MAIN EDIT MODE

            if (swipe_direction == 'up'):
                self.current_mode = 'filter set'
                print('FILTER SET MODE')
            elif (swipe_direction == 'right'):
                self.current_mode = 'instrument select'
                print('INSTRUMENT SELECT MODE')
            elif (swipe_direction == 'left'):
                self.current_mode = 'parameter set'
                print('PARAMETER SELECT MODE')
            
        
        return ['nah', 'nah']