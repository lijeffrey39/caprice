
import copy
import logging
import os
import time
import socket

import numpy
from engineio.payload import Payload
from flask import Flask, render_template, jsonify
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
effects_set = {
    'up': 'distortion',
    'down': 'chorus',
    'left': 'panner',
    'right': 'wah'
}

@app.route("/")
def index_file():
    return render_template('index.html')


@app.route("/right")
def right_file():
    return render_template('page-right.html')

@app.route("/ip", methods=["GET"])
def index():
    ip = get_Host_name_IP()
    api_response = {
        "status": "success",
        "message": ip
    }
    return jsonify(api_response)


@socketio.on('my event')
def notification(message): 

    global current_mode
    global up_effect
    global down_effect
    global left_effect
    global right_effect
    global home_release
    global effects_set

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
    toggled_effects = []
    untoggled_effects = []

    if swipe_direction != 'none':
        if current_mode == 'play':
            if swipe_direction == 'up':
                if up_effect:
                    up_effect = False
                    untoggled_effects.append(effects_set['up'])
                    print('%s EFFECT DISABLED' %effects_set['up'])
                else:
                    up_effect = True
                    toggled_effects.append(effects_set['up'])
                    print('%s EFFECT ENABLED' %effects_set['up'])
        
            elif swipe_direction == 'down':
                if down_effect:
                    down_effect = False
                    untoggled_effects.append(effects_set['down'])
                    print('%s EFFECT DISABLED' %effects_set['down'])
                else:
                    down_effect = True
                    toggled_effects.append(effects_set['down'])
                    print('%s EFFECT ENABLED' %effects_set['down'])

            elif swipe_direction == 'right':
                if right_effect:
                    right_effect = False
                    untoggled_effects.append(effects_set['right'])
                    print('%s EFFECT DISABLED' %effects_set['right'])
                else:
                    right_effect = True
                    toggled_effects.append(effects_set['right'])
                    print('%s EFFECT ENABLED' %effects_set['right'])

            elif swipe_direction == 'left':
                if left_effect:
                    left_effect = False
                    untoggled_effects.append(effects_set['left'])
                    print('%s EFFECT DISABLED' %effects_set['left'])
                else:
                    left_effect = True
                    toggled_effects.append(effects_set['left'])
                    print('%s EFFECT ENABLED' %effects_set['left'])
            # print(toggled_effects)
            # print(untoggled_effects)
        else:
            # EDIT MODE SWIPES
            print(swipe_direction)
    
    

    if current_mode == 'play':

        direction = sd.detect_press(message['data'])
        pc.swipeControl(direction)

        gyro_vel = gv.velocity_output(message['data'])
        effects_toggle = []
        for effect in toggled_effects:
            effects_toggle.append({
                'toggle': True,
                'name': effect,
                'params': {'wet': 0.5}
            })
        for disabled in untoggled_effects:
            effects_toggle.append({
                'toggle': False,
                'name': disabled
            })

        if gyro_vel != None:

            if gyro_vel['trigger'] == 'start':
                test_message({'notes': pc.current_notes, 'new_swipe': True,
                    'gyro': gyro_vel, 'effects_toggle': effects_toggle})
            elif gyro_vel['trigger'] == 'hold':
                test_message({'notes': pc.current_notes, 'new_swipe': False,
                    'gyro': gyro_vel, 'effects_toggle': effects_toggle})
            else:
                test_message({'notes': [], 'new_swipe': True, 'gyro': gyro_vel,
                    'effects_toggle': effects_toggle})
        
        else:
            test_message({'notes': [], 'new_swipe': False, 'gyro': gyro_vel,
                'effects_toggle': effects_toggle})
    

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


def get_Host_name_IP(): 
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ipAddress = s.getsockname()[0]
    # socketio.emit('ip address', ipAddress, broadcast=True)
    return ipAddress


if __name__ == "__main__":
    print("running")
    # get_Host_name_IP()
    socketio.run(app, host='0.0.0.0')
