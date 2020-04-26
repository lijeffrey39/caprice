const instruments = ["Bass", "Bassoon", "Cello", "Clarinet", "Contrabass",
    "Flute", "French Horn", "Acoustic Guitar", "Electric Guitar", "Classical Guitar",
    "Harmonium", "Harp", "Organ", "Piano", "Saxophone", "Trombone", "Trumpet","Tuba",
    "Violin", "Xylophone","AMSynth", "FMSynth", "MembraneSynth","DuoSynth"];

class InstrumentSelect {
    constructor () {
        socket.on('send instrument', (msg) => {
            this.setInstrument(msg);
        });
        this.currInstrument = 'Bass'
        this.selectedInstrument = 'Bass'
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