from gesture_detection import GestureDetector
from swipe_detection import SwipeDetector
from phone_controller import PhoneController
from gyro_velocity import GyroVelocity
from play_mode import PlayMode
from instrument_select import InstrumentSelect
from filter_select import FilterSelect


class Caprice:

    def __init__(self):
        self.sd = SwipeDetector()
        self.gd = GestureDetector()
        
        self.play_mode = PlayMode()
        self.filter_select = FilterSelect(self.play_mode.effects_set)
        
        self.inSel = InstrumentSelect(self.play_mode.toggled_instrument)

        self.current_mode = "play"
        self.home_release = True
        self.back_release = True

       
    
    def parse_notification(self,data):

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
        direction = self.sd.detect_press(data)

        #touchpad swipe direction
        swipe_direction = self.sd.receiveData(data)

        if self.current_mode == 'play':
            message = self.play_mode.generate_message(swipe_direction,
                                                          direction,
                                                          data)
            return ['play', message]
        
        elif self.current_mode == 'filter set':
            self.current_mode = 'filter set'
            
        elif self.current_mode == 'instrument select':
            self.current_mode = 'instrument select'
            (newIn, changeIn, changed) = self.inSel.instrumentNotification(swipe_direction, data['triggerButton'])
            if (changed):
                res = {'instrument': newIn, 'change': changeIn}
                self.play_mode.toggled_instrument = newIn
                return ['instrument select', res]
        else:
            # MAIN EDIT MODE

            if (swipe_direction == 'up'):
                self.current_mode = 'filter set'
                print('FILTER SET MODE')
            elif (swipe_direction == 'right'):
                self.current_mode = 'instrument select'
                print('INSTRUMENT SELECT MODE')
            
        
        return ['nah', 'nah']