import React from 'react';
import SocketIOClient from 'socket.io-client';
import { Button, View, Text, Vibration } from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

export class Sockets extends React.Component{

	constructor() { 
        super();
        this.socket = SocketIOClient("http://10.0.0.144:5000/test", {query: 'b64=1'});
        this.state = {}
        this.socket.on("this data", msg => {
            this.setState(msg['data'])
        });
    }

    sendMessage() {
    	this.socket.emit('button press', 1);
    	// Vibration.vibrate(1000);
    	// const options = {
		//   enableVibrateFallback: true,
		//   ignoreAndroidSystemSettings: false
		// };

		// ReactNativeHapticFeedback.trigger("impactLight");
    }

    render() {
        return (
			<View style={{margin: 10}}>
       			<Button
		          title="Press me"
		          onPress={() => this.sendMessage()}
		        />
       		</View>
        );
    }

}