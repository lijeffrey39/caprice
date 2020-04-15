
import copy
import logging
import os
import time

import numpy
from engineio.payload import Payload
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from gesture_detection import GestureDetector
from swipe_detection import SwipeDetector
from phone_controller import PhoneController
from gyro_velocity import GyroVelocity

Payload.max_decode_packets = 100
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app)
sd = SwipeDetector()
pc = PhoneController()
gd = GestureDetector()
gv = GyroVelocity()

pc.current_notes = ['C4'] #, 'E4', 'G4']

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

current_note = []

up_effect = False
right_effect = False
left_effect = False
down_effect = False
current_mode = "play"
home_release = True

@app.route("/")
def index_file():
    return render_template('index.html')


@socketio.on('my event')
def notification(message): 

    global current_mode
    global up_effect
    global down_effect
    global left_effect
    global right_effect
    global home_release

    if message['data']['homeButton']:
        if home_release:
            if current_mode == 'play':
                current_mode = 'edit'
                print('EDIT MODE')
            else:
                current_mode = 'play'
                print('PLAY MODE')

            home_release = False
    else:
        if not home_release:
            home_release = True

    swipe_direction = sd.receiveData(message['data'])
    if swipe_direction != 'none':
        if current_mode == 'play':
            if swipe_direction == 'up':
                if up_effect:
                    up_effect = False
                    print('UP EFFECT DISABLED')
                else:
                    up_effect = True
                    print('UP EFFECT ENABLED')
            elif swipe_direction == 'down':
                if down_effect:
                    down_effect = False
                    print('DOWN EFFECT DISABLED')
                else:
                    down_effect = True
                    print('DOWN EFFECT ENABLED')
            elif swipe_direction == 'right':
                if right_effect:
                    right_effect = False
                    print('RIGHT EFFECT DISABLED')
                else:
                    right_effect = True
                    print('RIGHT EFFECT ENABLED')
            elif swipe_direction == 'left':
                if left_effect:
                    left_effect = False
                    print('LEFT EFFECT DISABLED')
                else:
                    left_effect = True
                    print('LEFT EFFECT ENABLED')
        else:
            # EDIT MODE SWIPES
            print(swipe_direction)

    if current_mode == 'play':

        direction = sd.detect_press(message['data'])
        pc.swipeControl(direction)

        gyro_vel = gv.velocity_output(message['data'])
        if gyro_vel != None:
            if gyro_vel['trigger'] == 'start':
                test_message({'notes': pc.current_notes, 'new_swipe': True,
                    'gyro': gyro_vel})
            elif gyro_vel['trigger'] == 'hold':
                test_message({'notes': pc.current_notes, 'new_swipe': False,
                    'gyro': gyro_vel})
            else:
                test_message({'notes': [], 'new_swipe': True, 'gyro': gyro_vel})
    

    return
    # output = gd.gesture_output(message['data'])
    # if (output != None):
    #     if output == 'start':
    #         # current_note = ['C4', 'E4', 'G4']
    #         # emit('update value', {'notes': current_note, 'new_swipe': True}, broadcast=True)

    #         test_message({'notes': current_note, 'new_swipe': True})
    #         print('start')
    #     elif output == 'change':
    #         # current_note = ['D4', 'F4', 'A4']
    #         # emit('update value', {'notes': current_note, 'new_swipe': True}, broadcast=True)

    #         test_message({'notes': current_note, 'new_swipe': True})
    #         print('change')
        
        # elif output == 'end':
        #     # emit('update value', {'notes': [], 'new_swipe': True}, broadcast=True)
        #     test_message({'notes': [], 'new_swipe': True})
        #     print('end')
        # else:
        #     #output is 'hold'
        #     # emit('update value', {'notes': current_note, 'new_swipe': False}, broadcast=True)
        #     test_message({'notes': current_note, 'new_swipe': False})


@socketio.on('connect')
def test_connect():
    emit('after connect', {'data': 'Connected'}, broadcast=True)
    print("Connected")

prev = []
count = 0
total = 0

@socketio.on('button press')
def phone_notification(buttonsPressed):
    global current_note
    global prev
    global count 
    global total
    temp = []
    for note in buttonsPressed[0]:
        if (buttonsPressed[0][note]):
            temp.append(note + '4')
    if(copy.deepcopy(prev) != copy.deepcopy(buttonsPressed[0])):
        count += 1
        total += round(time.time() * 1000) - buttonsPressed[1]
        print(total / count)

    current_note = temp
    prev = buttonsPressed[0]

    # update pc.current_note
    pc.update_notes(buttonsPressed[0])

@socketio.on('notif')
# this is the note-playing socket
def test_message(value):
    # print('received')
    # print(message['data']['triggerButton'])
    emit('update value', value, broadcast=True)


if __name__ == "__main__":
    print("running")
    socketio.run(app, host='0.0.0.0')
