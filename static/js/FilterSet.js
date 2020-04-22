const filters = ['chorus', 'delay', 'distortion', 'reverb', 'tremolo',
    'vibrato', 'panner', 'wah'];

class FilterSet { 
    constructor () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);
        this.socket.on('send filter', (msg) => {
            this.setInstrument(msg);
        });

        this.generateInstruments();
        this.currInstrument = 'Bass'
        this.selectedInstrument = 'Bass'
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
        console.log(triggered)
        
        if (instrumentName != this.currInstrument) {
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

const is = new InstrumentSelect();

