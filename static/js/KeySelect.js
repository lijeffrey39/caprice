const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

class KeySelect {
    constructor () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);
        this.socket.on('send key', (msg) => {
            this.setKey(msg);
        });

        this.currInstrument = 'Bass'
        this.selectedInstrument = 'Bass'
        this.x = 0;
        this.y = 0;
        this.length = 6;
        this.width = Math.ceil(keys.length / this.length);
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
            para.id = 'instrument-text';
            para.innerText = keyName;

            card.appendChild(para);
            col.appendChild(card);
            keysRow.appendChild(col);
        }
    }

    setKey = (data) => {
        var instrumentName = data['instrument']
        var triggered = data['change']
        
        if (instrumentName != this.currInstrument) {
            console.log(this.currInstrument);
            var instrumentCard = document.getElementById(this.currInstrument);
            instrumentCard.classList.remove('highlighted');
            this.currInstrument = instrumentName;
            
            instrumentCard = document.getElementById(this.currInstrument);
            instrumentCard.classList.add('highlighted');
        }

        if (triggered) {
            var instrumentCard = document.getElementById(this.selectedInstrument);
            instrumentCard.classList.remove('selected');
            this.selectedInstrument = instrumentName;

            instrumentCard = document.getElementById(this.selectedInstrument);
            instrumentCard.classList.add('selected')
        }
    }
}