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

const formatResult = (currState) => {
    var res = {};
    for (var i = 0; i < data.length; i++) {
        const key = data[i]['key'];
        res[key] = currState[key];
    }
    return res;
}

const numColumns = 2;
export default class App extends React.Component {  
    constructor() { 
        super();
        this.socket = SocketIOClient("http://10.0.0.98:5000", {query: 'b64=1'});
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
            this.setState(msg['data']);
            console.log("huh");
        });
    }

    componentDidMount() {
        this._interval = setInterval(() => {
            // if (this.state.updated) {
            // console.log("emmitting");
            this.socket.emit('button press', [this.state, new Date().getTime()]);
            // }
        }, 20);
    }

    sendData = (key) => {
        this.setState(prevState => ({
            ...prevState,
            [key]: true
        }));
        this.state[key] = true;
        this.socket.emit('button press', [this.state, new Date().getTime()]);
        // this.setState({'updated': true});

        // setTimeout(() => {
        //     this.setState({'updated': false});
        // }, 8);
    }

    release = (key) => {
        this.setState(prevState => ({
            ...prevState,
            [key]: false
        }));
        this.state[key] = false;
        this.socket.emit('button press', [this.state, new Date().getTime()]);
        // this.setState({'updated': true});

        // setTimeout(() => {
        //     this.setState({'updated': false});
        // }, 8);
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

// const height = Dimensions.get('window').height;
// const width = Dimensions.get('window').width;
const height = 500;
const width = 400;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 250,
        position: 'absolute',
        right: 0,
        marginTop: 100
    },
    item: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: height / 4, // approximate a square
        width: width / 2
    },
    itemPressed: {
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: height / 4, // approximate a square
        width: width / 2
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