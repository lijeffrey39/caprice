
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

pc.current_notes = ['C4', 'E4', 'G4']

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

current_note = []
prev_gyrovel_x = 0
prev_gyrovel_y = 0
prev_gyrovel_z = 0

@app.route("/")
def index_file():
    return render_template('index.html')

first = False
tog = False
@socketio.on('my event')
def notification(message): 
    # direction = sd.receiveData(message['swipes'])
    direction = sd.detect_press(message['data'])
    pc.swipeControl(direction)
    gyro_vel = gv.velocity_output(message['data'])

    global prev_gyrovel_x
    global prev_gyrovel_y
    global prev_gyrovel_z
    
    if gyro_vel != None:
        if(gyro_vel['x'] != prev_gyrovel_x):
            prev_gyrovel_x = gyro_vel['x']
            print("X GYRO VELOCITY: ", gyro_vel['x'])
        if(gyro_vel['y'] != prev_gyrovel_y):
            prev_gyrovel_y = gyro_vel['y']
            print("Y GYRO VELOCITY: ", gyro_vel['y'])
        if(gyro_vel['z'] != prev_gyrovel_z):
            prev_gyrovel_z = gyro_vel['z']
            print("Z GYRO VELOCITY: ", gyro_vel['z'])

    # test_message({'notes': pc.current_notes, 'new_swipe': False})

    global first, tog
    if first:
        test_message({'notes': pc.current_notes, 'new_swipe': True,
            'gyro': gyro_vel})
        # , 'effects_toggle': 
        #     {'toggle': tog,
        #     'name': 'tremolo', 
        #     'params': {'freq': 10,
        #                 'depth': 0.9}}})
        first = False
    else:
        test_message({'notes': pc.current_notes, 'new_swipe': False,
            'gyro': gyro_vel})
            
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

@socketio.on('bietch')
def bietch():
    global first, tog
    first = True
    tog = not tog
    print('yuk')


if __name__ == "__main__":
    print("running")
    socketio.run(app, host='0.0.0.0')
