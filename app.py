
from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit
from gesture_detection import GestureDetector
import os
import time
import numpy

# creates a Flask application, named app

app = Flask(__name__)
socketio = SocketIO(app)

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
def hello():
    return render_template('index.html', token = "hi")

@socketio.on('my event', namespace='/test')
def notification(message):
    gd.gesture_output(message['data'])

    
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


@socketio.on('connect', namespace='/test')
def test_connect():
    # emit('my response', {'data': 'Connected'}, broadcast=True)
    print("Connected")


@socketio.on('button press', namespace='/test')
def test_connect(buttonNum):
    print("Button Pressed", buttonNum)


# run the application
if __name__ == "__main__":
    # app.run(debug=True)
    print("running")
    socketio.run(app, host='0.0.0.0')