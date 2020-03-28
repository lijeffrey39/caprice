
from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit
from gesture_detection import GestureDetector
import logging
import os
import time
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


@app.route("/")
def index_file():
    return render_template('index.html')

@socketio.on('my event', namespace='/test')
def notification(message):
    gd.gesture_output(message['data'])

@socketio.on('swipe event', namespace='/test')
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

@socketio.on('button press', namespace='/test')
def test_connect1(buttonNum):
    print("Button Pressed", buttonNum)

@socketio.on('notif')
# this is the note-playing socket
def test_message():
    print('received')
    # print(message['data']['triggerButton'])
    emit('update value', {'notes': ['C4', 'E4', 'G4'], 'new_swipe': True}, broadcast=True)

if __name__ == "__main__":
    print("running")
    socketio.run(app, host='0.0.0.0')
