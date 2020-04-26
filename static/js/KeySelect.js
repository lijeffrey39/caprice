const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modes = ['ionian', 'lydian', 'mixolydian', 'locrian', 'aeolian', 'dorian', 'phrygian'];

class KeySelect {
    constructor () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);
        this.socket.on('key mode', (msg) => {
            this.setKey(msg[0], msg[1]);
            this.setMode(msg[2], msg[3]);
        });

        this.currKey = 'C';
        this.selectedKey = 'C';

        this.currMode = 'ionian';
        this.selectedMode = 'ionian';
    }

    generateModes = () => {
        var modesRow = document.getElementById("modes-list");
        for (var i = 0; i < modes.length; i++) {
            const keyName = modes[i];
            var col = document.createElement("div");
            col.className = 'col-3';

            var card = document.createElement("div");
            card.id = keyName;
            card.className = 'card mb-4 shadow-sm instrument-card';

            var para = document.createElement("p");
            para.id = 'modes-text';
            para.innerText = keyName;

            card.appendChild(para);
            col.appendChild(card);
            modesRow.appendChild(col);
        }
    }
        
    generateKeys = () => {
        var keysRow = document.getElementById("keys-list");
        for (var i = 0; i < keys.length; i++) {
            const keyName = keys[i];
            var col = document.createElement("div");
            col.className = 'col-2';

            var card = document.createElement("div");
            card.id = keyName;
            card.className = 'card mb-4 shadow-sm instrument-card';

            var para = document.createElement("p");
            para.id = 'keys-text';
            para.innerText = keyName;

            card.appendChild(para);
            col.appendChild(card);
            keysRow.appendChild(col);
        }
    }

    setKey = (key, setKey) => {
        var keyCard = document.getElementById(this.currKey);
        keyCard.classList.remove('highlighted');
        this.currKey = key;

        keyCard = document.getElementById(this.currKey);
        keyCard.classList.add('highlighted');

        var selectedKeyCard = document.getElementById(this.selectedKey);
        selectedKeyCard.classList.remove('selected');
        this.selectedKey = setKey;

        selectedKeyCard = document.getElementById(this.selectedKey);
        selectedKeyCard.classList.add('selected')
    }

    setMode = (currMode, selectedMode) => {
        var modeCard = document.getElementById(this.currMode);
        modeCard.classList.remove('highlighted');
        this.currMode = currMode;

        modeCard = document.getElementById(this.currMode);
        modeCard.classList.add('highlighted');

        var selectedModeCard = document.getElementById(this.selectedMode);
        selectedModeCard.classList.remove('selected');
        this.selectedMode = selectedMode;

        selectedModeCard = document.getElementById(this.selectedMode);
        selectedModeCard.classList.add('selected')
    }
}