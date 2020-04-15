const UUID_CUSTOM_SERVICE = "4f63756c-7573-2054-6872-65656d6f7465";
const UUID_CUSTOM_SERVICE_WRITE = "c8c51726-81bc-483b-a052-f7a14ea3d282";
const UUID_CUSTOM_SERVICE_NOTIFY = "c8c51726-81bc-483b-a052-f7a14ea3d281";

const CMD_OFF = '0000';
const CMD_SENSOR = '0100';
const CMD_VR_MODE = '0800';

const GYRO_FACTOR = 0.0001; // to radians / s
const ACCEL_FACTOR = 0.00001; // to g (9.81 m/s**2)
const TIMESTAMP_FACTOR = 0.001; // to seconds

class Caprice {
    constructor() {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);

        this.customServiceWrite = null;
        this.customServiceNotify = null;
        this.gattServer = null;

        this.onControllerDataReceived  = this.onControllerDataReceived.bind(this);
        this.onDeviceConnected = this.onDeviceConnected.bind(this);
        this.onNotificationReceived = this.onNotificationReceived.bind(this);
        this.runCommand = this.runCommand.bind(this);
        this.getLittleEndianUint8Array = this.getLittleEndianUint8Array(this);
        this.getAccelerometerFloatWithOffsetFromArrayBufferAtIndex = this.getAccelerometerFloatWithOffsetFromArrayBufferAtIndex.bind(this);
        this.getGyroscopeFloatWithOffsetFromArrayBufferAtIndex = this.getGyroscopeFloatWithOffsetFromArrayBufferAtIndex.bind(this);
        this.getMagnetometerFloatWithOffsetFromArrayBufferAtIndex = this.getMagnetometerFloatWithOffsetFromArrayBufferAtIndex.bind(this);

        if (navigator.bluetooth) {
            console.log("yo")
            document.getElementById('deviceActionsButton').addEventListener(
                'click', this.pair
            );
        } else {
            console.log("hi")
            document.getElementById('webbluetoothNotSupported').classList.add('show');
        }
    }

    onDeviceConnected(device) {
        console.log("connecting to bluetooth device");
        return device.gatt.connect().catch(function(){
            console.log("error caught, trying to connect again");
            device.gatt.connect();
        });
    }

    pair() {
        console.log("pairing");
        return navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'Gear' }], 
            optionalServices: [UUID_CUSTOM_SERVICE]
        })  .then(this.onDeviceConnected)
            .then(gattServer => this.gattServer = gattServer)
            .then(() => this.gattServer.getPrimaryService(UUID_CUSTOM_SERVICE))
            .then(customService => this.customService = customService)
            .then(() => this.customService
                .getCharacteristic(UUID_CUSTOM_SERVICE_WRITE)
                .then(characteristic => this.customServiceWrite = characteristic))
            .then(() => this.customService
                .getCharacteristic(UUID_CUSTOM_SERVICE_NOTIFY)
                .then(characteristic => this.customServiceNotify = characteristic))
            .then(() => this.customServiceNotify
                .startNotifications()
                .then(() => {
                    this.customServiceNotify.addEventListener('characteristicvaluechanged', this.onNotificationReceived);
                    this.startSensorData();
                }));
    }

    startSensorData() {
        this.runCommand(CMD_VR_MODE)
            .then(() => this.runCommand(CMD_SENSOR)
            .then(() => this.runCommand(CMD_VR_MODE)
            .then(() => this.runCommand(CMD_SENSOR))
            .then(() => this.runCommand(CMD_VR_MODE))));
    }

    onNotificationReceived(e) {
        const {buffer}  = e.target.value;
        const eventData = new Uint8Array(buffer);

        const axisX = (
            ((eventData[54] & 0xF) << 6) +
            ((eventData[55] & 0xFC) >> 2)
        ) & 0x3FF;

        const axisY = (
            ((eventData[55] & 0x3) << 8) +
            ((eventData[56] & 0xFF) >> 0)
        ) & 0x3FF;

        const temperature = eventData[57];
        const accel = [
            this.getAccelerometerFloatWithOffsetFromArrayBufferAtIndex(buffer, 4, 0),
            this.getAccelerometerFloatWithOffsetFromArrayBufferAtIndex(buffer, 6, 0),
            this.getAccelerometerFloatWithOffsetFromArrayBufferAtIndex(buffer, 8, 0)
        ].map(v => v * ACCEL_FACTOR);

        const gyro = [
            this.getGyroscopeFloatWithOffsetFromArrayBufferAtIndex(buffer, 10, 0),
            this.getGyroscopeFloatWithOffsetFromArrayBufferAtIndex(buffer, 12, 0),
            thi.sgetGyroscopeFloatWithOffsetFromArrayBufferAtIndex(buffer, 14, 0)
        ].map(v => v * GYRO_FACTOR);

        const magX = getMagnetometerFloatWithOffsetFromArrayBufferAtIndex(buffer, 0);
        const magY = getMagnetometerFloatWithOffsetFromArrayBufferAtIndex(buffer, 2);
        const magZ = getMagnetometerFloatWithOffsetFromArrayBufferAtIndex(buffer, 4);

        const triggerButton    = Boolean(eventData[58] & (1 << 0));
        const homeButton       = Boolean(eventData[58] & (1 << 1));
        const backButton       = Boolean(eventData[58] & (1 << 2));
        const touchpadButton   = Boolean(eventData[58] & (1 << 3));
        const volumeUpButton   = Boolean(eventData[58] & (1 << 4));
        const volumeDownButton = Boolean(eventData[58] & (1 << 5));

        this.onControllerDataReceived({
            accel,
            gyro,
            magX, magY, magZ,
            temperature,
            axisX, axisY,
            triggerButton,
            homeButton,
            backButton,
            touchpadButton,
            volumeUpButton,
            volumeDownButton
        });
    }

    onControllerDataReceived(data) {
        var result = {'accel': data['accel'], 
                      'axisX': data['axisX'],
                      'axisY': data['axisY'],
                      'gyro' : data['gyro'],
                      'triggerButton': data['triggerButton'],
                      'touchpadButton': data['touchpadButton']}
        this.socket.emit('my event', {data: result});
    }

    getAccelerometerFloatWithOffsetFromArrayBufferAtIndex = (arrayBuffer, offset, index) => {
        const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + offset, 16 * index + offset + 2));
        return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 2048.0]))[0];
    };
    
    getGyroscopeFloatWithOffsetFromArrayBufferAtIndex = (arrayBuffer, offset, index) => {
        const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + offset, 16 * index + offset + 2));
        return (new Float32Array([arrayOfShort[0] * 10000.0 * 0.017453292 / 14.285]))[0];
    };
    
    getMagnetometerFloatWithOffsetFromArrayBufferAtIndex = (arrayBuffer, offset) => {
        const arrayOfShort = new Int16Array(arrayBuffer.slice(32 + offset, 32 + offset + 2));
        return (new Float32Array([arrayOfShort[0] * 0.06]))[0];
    };
    
    getLittleEndianUint8Array = hexString => {
        const leAB = new Uint8Array(hexString.length >> 1);
        for (let i = 0, j = 0; i + 2 <= hexString.length; i += 2, j++) {
            leAB[j] = parseInt(hexString.substr(i, 2), 16);
        }
        return leAB;
    };

    runCommand(commandValue) {
        return this.customServiceWrite.writeValue(this.getLittleEndianUint8Array(commandValue))
            .catch(e => {
                console.warn('Error: ' + e);
            });
    }
}