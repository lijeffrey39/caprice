
import copy
import logging
import os
import socket
import time
import json

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
        emit('mode', caprice.current_mode, broadcast=True)

    if (result['backPressed']):
        emit('edit', 'back', broadcast=True)

    if (result['editModeChanged']):
        emit('edit', caprice.edit_mode, broadcast=True)

    # play or edit mode
    if (result['mode'] == 'play'):
        # if result['output']['new_swipe'] or result['output']['effects_toggle']:
        # print(result['output']['notes'])
        emitted = time.time()
        result['output']['time'] = emitted*1000
        test_message(result['output'])
    else:
        output = result['output']
        if (result['editMode'] == 'instrument select'):
            emit('send instrument', output, broadcast=True)
            if (output['change']):
                emit('instrument', output, broadcast=True)
        # set effect params and play notes at same time
        elif (result['editMode'] == 'parameter set'):
            set_effects(output['param_notif'])
            test_message(output)
        elif (result['editMode'] == 'filter set'):
            if (output != None):
                if ('toggle' in output):
                    emit('send filter toggle', output, broadcast=True)
                else:
                    emit('send filter', output, broadcast=True)
        elif (result['editMode'] == 'key set'):
            if output:
                 emit('key mode', output, broadcast=True)


@socketio.on('connect')
def test_connect():
    emit('after connect', {'data': 'Connected'}, broadcast=True)
    print("Connected")


@socketio.on('notif') # this is the note-playing socket
def test_message(value):
    emit('update value', value, broadcast=True)


def send_notes(notes):
    data = {'notes': notes}
    emit('update notes', data, broadcast=True)


prevState = {}
totalPing = 0
total = 0

@socketio.on('button press')
def phone_notification(buttonsPressed):
    global prevState
    global totalPing
    global total

    if (json.dumps(buttonsPressed[0]) != json.dumps(prevState)):
        caprice.play_mode.pc.update_notes(buttonsPressed[0])
        send_notes(caprice.play_mode.pc.current_notes)
        emit('notes back', caprice.play_mode.pc.octave_number, broadcast=True)
        prevState = buttonsPressed[0]

        total += 1
        if (total <= 5):
            return
        totalPing += (time.time() * 1000) - buttonsPressed[1]
        print((time.time() * 1000) - buttonsPressed[1])


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
