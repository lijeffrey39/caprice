const instruments = ["Bass", "Bassoon", "Cello", "Clarinet", "Contrabass",
    "Flute", "French Horn", "Acoustic Guitar", "Electric Guitar", "Classical Guitar",
    "Harmonium", "Harp", "Organ", "Piano", "Saxophone", "Trombone", "Trumpet","Tuba",
    "Violin", "Xylophone"];

class InstrumentSelect {
    constructor () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);
        console.log(this.socket);
        this.generateInstruments();
        this.x = 0;
        this.y = 0;
        this.length = 6;
        this.width = Math.ceil(instruments.length / this.length);
        this.moveInstrumentSelect  = this.moveInstrumentSelect.bind(this);
        this.checkValidMove  = this.checkValidMove.bind(this);
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

    moveValue = (direction, x, y) => {
        var tempX = this.x;
        var tempY = this.y;
        if (direction === 'up') {
            tempY -= 1;
        } else if (direction === 'down') {
            tempY += 1;
        } else if (direction === 'right') {
            tempX += 1;
        } else {
            tempX -= 1;
        }
        return (tempX, tempY);
    }

    // checkValidMove = (direction) => {
    //     (newX, newY) = moveValue(direction, this.x, this.y);
    //     if (newX >=)
    // }


    moveInstrumentSelect = (direction) => {
        console.log(direction);
        if (!this.checkValidMove(direction)) {
            return;
        }
    }
}

const is = new InstrumentSelect();

$(document).on("keyup", "body", function(e) {
    if (e.keyCode == 38) {
        is.moveInstrumentSelect('up');
    }
    if (e.keyCode == 40) {
        is.moveInstrumentSelect('down');
    }
    if (e.keyCode == 37) {
        is.moveInstrumentSelect('left');
    }
    if (e.keyCode == 39) {
        is.moveInstrumentSelect('right');
    }
})