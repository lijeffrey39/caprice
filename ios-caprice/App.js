import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import SocketIOClient from 'socket.io-client';

const data = [
    { key: 'C' }, { key: 'G' }, { key: 'D' }, { key: 'A' }, { key: 'E' }, { key: 'B' }, { key: 'F' }, { key: 'Z' }
];

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
        numberOfElementsLastRow++;
    }

    return data;
};

const numColumns = 2;
export default class App extends React.Component {  
  
    constructor() { 
        super();
        this.socket = SocketIOClient("http://10.0.0.144:5000", {query: 'b64=1'});
        this.state = {
        "A": false,
        "B": false,
        "C": false,
        "D": false,
        "E": false,
        "F": false,
        "G": false,
        "Z": false
        }
        this.socket.on("this data", msg => {
            this.setState(msg['data'])
        });
    }

    componentDidMount() {
        this._interval = setInterval(() => {
        this.socket.emit('button press', this.state);
        }, 1000 / 25);
    }

    sendData = (key) => {
        this.setState(prevState => ({
            ...prevState,
            [key]: true
        }));
        this.state[key] = true;
    }

    release = (key) => {
        this.setState(prevState => ({
            ...prevState,
            [key]: false
        }));
        this.state[key] = false;
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View onTouchStart={() => this.sendData(item.key)} onTouchEnd={() => this.release(item.key)}
                style={this.state[item.key] ? styles.item : styles.itemPressed}>
                <Text style={this.state[item.key] ? styles.itemText : styles.itemTextPressed}>{item.key}</Text>
            </View>
        );
    };

    render() {
        return (
            <FlatList
                extraData={this.state}
                data={formatData(data, numColumns)}
                style={styles.container}
                renderItem={this.renderItem}
                numColumns={numColumns}
                scrollEnabled={false}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: Dimensions.get('window').height / 4, // approximate a square
        width: Dimensions.get('window').width / 2
    },
    itemPressed: {
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: Dimensions.get('window').height / 4, // approximate a square
        width: Dimensions.get('window').width / 2
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: 'black',
    },
    itemTextPressed: {
        color: 'white',
    },
});