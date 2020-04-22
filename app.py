
import copy
import logging
import os
import socket
import time

import numpy
from engineio.payload import Payload
from flask import Flask, jsonify, render_template
from flask_socketio import SocketIO, emit

from caprice import Caprice

Payload.max_decode_packets = 100
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app)
caprice = Caprice()


@app.route("/")
def index_file():
    return render_template('index.html')


@app.route("/ip", methods=["GET"])
def index():
    ip = get_Host_name_IP()
    api_response = {"status": "success", "message": ip}
    return jsonify(api_response)


@socketio.on('my event')
def notification(message):
    result = caprice.parse_notification(message['data'])
    # mode updated (send to front end once)
    if (result['modeChanged']):
        toggle_mode(caprice.current_mode)
        print(caprice.current_mode)

    # play or edit mode
    if (result['mode'] == 'play'):
        test_message(result['output'])
    else:
        if (result['editMode'] == 'instrument select'):
            send_instrument(result['output'])
            if (result['output']['change']):
                set_instrument(result['output'])
        elif (result['editMode'] == 'parameter set'):
            set_effects(result['output'])


@socketio.on('connect')
def test_connect():
    emit('after connect', {'data': 'Connected'}, broadcast=True)
    print("Connected")


@socketio.on('notif') # this is the note-playing socket
def test_message(value):
    emit('update value', value, broadcast=True)


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
    pc.update_notes(buttonsPressed[0])


@socketio.on('sendInstrument')
def send_instrument(value):
    emit('send instrument', value, broadcast=True)

@socketio.on('instrument')
def set_instrument(value):
    emit('instrument', value, broadcast=True)


@socketio.on('editmode')
def toggle_mode(mode):
    emit('mode', mode, broadcast=True)


def set_effects(value):
    emit('effects tune', value, broadcast=True)
    emit('new effect', value, broadcast=True)

def get_Host_name_IP(): 
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ipAddress = s.getsockname()[0]
    return ipAddress


if __name__ == "__main__":
    print("running")
    socketio.run(app, host='0.0.0.0')
