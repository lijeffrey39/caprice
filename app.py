
import logging
import os

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


@app.route("/")
def index_file():
    return render_template('index.html')

@socketio.on('connect')
def test_connect():
    emit('after connect', {'data': 'Connected'}, broadcast=True)
    print("Connected")

@socketio.on('my event', namespace='/test')
def notification(message):
    direction = sd.receiveData(message)[0]
    if (direction != 'none'):
        print(direction)
    emit('this data', {'data': message}, broadcast=True)

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
