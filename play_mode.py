from gyro_velocity import GyroVelocity
from phone_controller import PhoneController

class PlayMode:

    def __init__(self):

        self.up_effect = False
        self.right_effect = False
        self.left_effect = False
        self.down_effect = False
        
        self.gv = GyroVelocity()
        self.pc = PhoneController()

        self.pc.current_notes = ['C4']
        self.toggled_instrument = 'Piano'
        self.effects_set = {
            'up': 'distortion',
            'down': 'chorus',
            'left': 'panner',
            'right': 'wah'
        }
    
    def generate_message(self,swipe_direction, direction, data):
        
        toggled_effect = None
        untoggled_effect = None

        if swipe_direction == 'up':
                if self.up_effect:
                    self.up_effect = False
                    untoggled_effect = self.effects_set['up']
                    print('%s EFFECT DISABLED' %self.effects_set['up'])
                else:
                    self.up_effect = True
                    toggled_effect = self.effects_set['up']
                    print('%s EFFECT ENABLED' %self.effects_set['up'])
        
        elif swipe_direction == 'down':
            if self.down_effect:
                self.down_effect = False
                untoggled_effect = self.effects_set['down']
                print('%s EFFECT DISABLED' %self.effects_set['down'])
            else:
                self.down_effect = True
                toggled_effect = self.effects_set['down']
                print('%s EFFECT ENABLED' %self.effects_set['down'])

        elif swipe_direction == 'right':
            if self.right_effect:
                self.right_effect = False
                untoggled_effect = self.effects_set['right']
                print('%s EFFECT DISABLED' %self.effects_set['right'])
            else:
                self.right_effect = True
                toggled_effect = self.effects_set['right']
                print('%s EFFECT ENABLED' %self.effects_set['right'])

        elif swipe_direction == 'left':
            if self.left_effect:
                self.left_effect = False
                untoggled_effect = self.effects_set['left']
                print('%s EFFECT DISABLED' %self.effects_set['left'])
            else:
                self.left_effect = True
                toggled_effect = self.effects_set['left']
                print('%s EFFECT ENABLED' %self.effects_set['left'])

        
        self.pc.swipeControl(direction)
        
        gyro_vel = self.gv.velocity_output(data)

        outcome = {}
        send = False

        final_message = {}

        if toggled_effect == None and untoggled_effect == None:
            send = False
        else:
            send = True
            if toggled_effect != None:
                outcome['toggle'] = True
                outcome['name'] = toggled_effect
            else:
                outcome['toggle'] = False
                outcome['name'] = untoggled_effect
        
        if gyro_vel != None:

            if gyro_vel['trigger'] == 'start':
                if send:
                    final_message = {'notes': self.pc.current_notes, 'new_swipe': True,
                        'gyro': gyro_vel, 'effects_toggle': outcome}
                else:
                    final_message = {'notes': self.pc.current_notes, 'new_swipe': True,
                        'gyro': gyro_vel}

            elif gyro_vel['trigger'] == 'hold':
                if send:
                    final_message = {'notes': self.pc.current_notes, 'new_swipe': False,
                        'gyro': gyro_vel, 'effects_toggle': outcome}
                else:
                    final_message = {'notes': self.pc.current_notes, 'new_swipe': False,
                        'gyro': gyro_vel}
            else:
                if send:
                    final_message = {'notes': [], 'new_swipe': False, 'gyro': gyro_vel,
                        'effects_toggle': outcome}
                else:
                    final_message = {'notes': [], 'new_swipe': False,
                        'gyro': gyro_vel}
        
        else:
            if send:
                final_message = {'notes': [], 'new_swipe': False, 'gyro': gyro_vel,
                    'effects_toggle': outcome}
            else:
                final_message = {'notes': [], 'new_swipe': False,
                        'gyro': gyro_vel}
        
        return final_message