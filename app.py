
from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit
from gesture_detection import GestureDetector
import logging
import os
import time
import copy
import numpy

from engineio.payload import Payload
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from swipe_detection import SwipeDetector

Payload.max_decode_packets = 100
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app)
sd = SwipeDetector()

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

gd = GestureDetector()

# a route where we will display a welcome message via an HTML template
# @app.route("/")
# def hello():
#     message = "Hello, World"
#     return render_template('index.html', message=message)

# counter = 0
# startLog = False
# start = None
# end = None
# counter_values = []
# total_time = 0

current_note = []

@app.route("/")
def index_file():
    return render_template('index.html')

@socketio.on('my event')
def notification(message):
    global current_note


    test_message({'notes': current_note, 'new_swipe': False})   
    return
    # output = gd.gesture_output(message['data'])
    # if (output != None):
    #     test_message({'notes': current_note, 'new_swipe': True})
    #     return
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
        
    #     elif output == 'end':
    #         # emit('update value', {'notes': [], 'new_swipe': True}, broadcast=True)
    #         test_message({'notes': [], 'new_swipe': True})
    #         print('end')
    #     else:
    #         #output is 'hold'
    #         # emit('update value', {'notes': current_note, 'new_swipe': False}, broadcast=True)
    #         test_message({'notes': current_note, 'new_swipe': False})

@socketio.on('swipe event')
def swipe_notification(message):
    direction = sd.receiveData(message)[0]
    if (direction != 'none'):
        print(direction)
    
    #Notification timer code
    # global startLog
    # global counter
    # global end
    # global start
    # global counter_values
    # global total_time

    # if startLog:
    #     end = time.time()
    #     if end - start >= 10:
    #         # print("# Notifications Received: ", counter)
    #         counter_values.append(counter)
    #         total_time += 10

    #         print('Moving Average: ', numpy.mean(counter_values))
    #         print('Over ', total_time, ' seconds')

    #         startLog = False
    #         start = None
    #         end = None
    #         counter = 0
        
    #     else:
    #         counter += 1

    # else:
    #     startLog = True
    #     start = time.time()
    #     counter += 1
    

    # print(message)
    # print(message['data']['triggerButton'])
    # emit('this data', {'data': message['data']}, broadcast=True)

@socketio.on('connect')
def test_connect():
    emit('after connect', {'data': 'Connected'}, broadcast=True)
    print("Connected")

prev = []
count = 0
total = 0

@socketio.on('button press')
def test_connect1(buttonsPressed):
    # print(buttonsPressed)
    global current_note
    global prev
    global count 
    global total
    # temp = []
    # for note in buttonsPressed:
    #     if (buttonsPressed[0][note]):
    #         temp.append(note)
    if(copy.deepcopy(prev) != copy.deepcopy(buttonsPressed[0])):
        # print(round(time.time() * 1000) - buttonsPressed[1])
        count += 1
        total += round(time.time() * 1000) - buttonsPressed[1]
        print(total / count)

    prev = buttonsPressed[0]
    # print("Button Pressed", current_note)

@socketio.on('notif')
# this is the note-playing socket
def test_message(value):
    # print('received')
    # print(message['data']['triggerButton'])
    emit('update value', value, broadcast=True)

if __name__ == "__main__":
    print("running")
    socketio.run(app, host='0.0.0.0')
