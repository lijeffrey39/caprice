
import copy
import logging
import os
import time
import socket

import numpy
from engineio.payload import Payload
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit

from caprice import Caprice

Payload.max_decode_packets = 100
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app)

caprice = Caprice()

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


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
    
    parse_result = caprice.parse_notification(message['data'])

    if 'play' in parse_result:
        test_message(parse_result[1])


    return


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
