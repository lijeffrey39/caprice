
from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit
import os

# creates a Flask application, named app

app = Flask(__name__)
socketio = SocketIO(app)

# a route where we will display a welcome message via an HTML template
# @app.route("/")
# def hello():
#     message = "Hello, World"
#     return render_template('index.html', message=message)

@app.route("/")
def hello():
    return render_template('index.html', token = "hi")

@socketio.on('my event', namespace='/test')
def test_message(message):
    # print(message)
    # print(message['data']['triggerButton'])
    emit('this data', {'data': message['data']}, broadcast=True)


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