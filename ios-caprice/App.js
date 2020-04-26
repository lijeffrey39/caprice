import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity} from 'react-native';
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
        this.state = {
            "A": false,
            "B": false,
            "C": false,
            "D": false,
            "E": false,
            "F": false,
            "G": false,
            "Z": false,
            'inputText': '',
            'socket': null,
            'octave': 8
        }
    }

    componentDidMount() {
        this._interval = setInterval(() => {
            if (this.state.socket) {
                this.state.socket.emit('button press', [formatResult(this.state), new Date().getTime()]);
            }
        }, 20);
    }

    sendData = (key) => {
        this.setState(prevState => ({
            ...prevState,
            [key]: true
        }));
        this.state[key] = true;
        if (this.state.socket) {
            this.state.socket.emit('button press', [formatResult(this.state), new Date().getTime()]);
        }
    }

    release = (key) => {
        this.setState(prevState => ({
            ...prevState,
            [key]: false
        }));
        this.state[key] = false;
        if (this.state.socket) {
            this.state.socket.emit('button press', [formatResult(this.state), new Date().getTime()]);
        }
    }

    currOctave = (i) => {
        if (this.state.octave % 2 === 0) {
            return (this.state.octave / 2);
        } else {
            if (i < 4) {
                return (this.state.octave / 2);
            } else {
                return Math.floor(this.state.octave / 2) + 1;
            }
        }
    }

    currNote = (note) => {
        if (note === 'Z') {
            return 'C';
        }
        return note;
    }

    renderItem = ({ item, i }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View onTouchStart={() => this.sendData(item.key)} onTouchEnd={() => this.release(item.key)}
                style={this.state[item.key] ? styles.item : styles.itemPressed}>
                <Text style={this.state[item.key] ? styles.itemText : styles.itemTextPressed}>{this.currNote(item.key) + this.currOctave(i)}</Text>
            </View>
        );
    };

    formatIP = () => {
        return 'http://' + this.state.inputText + ':5000';
    }

    render() {
        return (
            <View style={styles.realContainer}>
                <FlatList
                    extraData={this.state}
                    data={formatData(data, numColumns)}
                    style={styles.container}
                    renderItem={this.renderItem}
                    numColumns={numColumns}
                    scrollEnabled={false}/>
                <TextInput
                    style={{ height: 30, borderColor: 'gray', borderRadius: 5, borderWidth: 1, marginTop: 40, marginLeft: 20, marginRight: 20 }}
                    onChangeText={text => this.setState({'inputText': text})}
                    value={this.state.inputText}/>
                <TouchableOpacity
                    style={styles.loginScreenButton}
                    underlayColor='#fff'
                    onPress={() => {
                        const tempSocket = SocketIOClient(this.formatIP(), {query: 'b64=1'});
                        this.setState({socket: tempSocket});
                        tempSocket.on("notes back", msg => {
                            this.setState({octave: msg});
                        });
                    }}>
                    <Text style={styles.loginText}>Update IP Address</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// const height = Dimensions.get('window').height;
// const width = Dimensions.get('window').width;
const height = 500;
const width = 400;

const styles = StyleSheet.create({
    loginScreenButton:{
        marginRight:40,
        marginLeft:40,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#1E6738',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    loginText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    },
    realContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 30
    },
    container: {
        flex: 1,
        width: 250,
        position: 'absolute',
        right: 0,
        marginTop: 150
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