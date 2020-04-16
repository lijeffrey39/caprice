const instruments = ["Bass", "Bassoon", "Cello", "Clarinet", "Contrabass",
    "Flute", "French Horn", "Acoustic Guitar", "Electric Guitar", "Classical Guitar",
    "Harmonium", "Harp", "Organ", "Piano", "Saxophone", "Trombone", "Trumpet","Tuba",
    "Violin", "Xylophone"];

class InstrumentSelect {
    constructor () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);
        this.socket.on('send instrument', function(msg) {
            console.log(msg);
        });

        this.generateInstruments();
        this.x = 0;
        this.y = 0;
        this.length = 6;
        this.width = Math.ceil(instruments.length / this.length);
        this.moveInstrumentSelect  = this.moveInstrumentSelect.bind(this);
    }

    generateInstruments = () => {
        var instrumentRow = document.getElementById("instrument-list");
        for (var i = 0; i < instruments.length; i++) {
            const instrumentName = instruments[i];
            var col = document.createElement("div");
            col.className = 'col-2';

            var card = document.createElement("div");
            card.className = 'card mb-4 shadow-sm instrument-card';

            var para = document.createElement("p");
            para.id = 'instrument-text';
            para.innerText = instrumentName;

            card.appendChild(para);
            col.appendChild(card);
            instrumentRow.appendChild(col);
        }
    }

    moveInstrumentSelect = (direction) => {
        console.log(direction);
        if (!this.checkValidMove(direction)) {
            return;
        }
    }
}

const is = new InstrumentSelect();