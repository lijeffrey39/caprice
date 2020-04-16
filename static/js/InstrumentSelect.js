const instruments = ["Bass", "Bassoon", "Cello", "Clarinet", "Contrabass",
    "Flute", "French Horn", "Acoustic Guitar", "Electric Guitar", "Classical Guitar",
    "Harmonium", "Harp", "Organ", "Piano", "Saxophone", "Trombone", "Trumpet","Tuba",
    "Violin", "Xylophone"];

class InstrumentSelect {
    constructor () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);
        this.socket.on('send instrument', (msg) => {
            this.setInstrument(msg);
        });

        this.generateInstruments();
        this.currInstrument = 'Bass'
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
            card.id = instrumentName;
            card.className = 'card mb-4 shadow-sm instrument-card';

            var para = document.createElement("p");
            para.id = 'instrument-text';
            para.innerText = instrumentName;

            card.appendChild(para);
            col.appendChild(card);
            instrumentRow.appendChild(col);
        }
    }

    setInstrument = (data) => {
        var instrumentName = data['instrument']
        var triggered = data['change']
        console.log(instrumentName)
        
        if (instrumentName != this.currInstrument) {
            var instrumentCard = document.getElementById(this.currInstrument);
            instrumentCard.classList.remove('highlighted');
            this.currInstrument = instrumentName;
            
            instrumentCard = document.getElementById(this.currInstrument);
            instrumentCard.classList.add('highlighted')
        }
    }
}

const is = new InstrumentSelect();