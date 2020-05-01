const filters = ['chorus', 'delay', 'distortion', 'reverb', 'tremolo',
    'vibrato', 'panner', 'wah', 'pitchshift'];

class FilterSet { 
    constructor () {
        socket.on('send filter', (msg) => {
            this.setFilter(msg);
        });

        socket.on('send filter toggle', (msg) => {
            this.setCursor(msg);
        })

        
        this.currFilter = 'chorus'
        this.selectedFilter = 'chorus'
        this.x = 0;
        this.y = 0;
        // this.length = 4;
        // this.width = Math.ceil(filters.length / this.length);

        this.currFilterSet = { up: 'distortion',
                                down: 'chorus',
                                left: 'panner',
                                right: 'wah' };

        this.currDirectionToggle = "";

        this.highlightColors = { up: 'highlighted',
                                down: 'down-highlighted',
                                left: 'left-highlighted',
                                right: 'right-highlighted' };
        
        this.selectedColors = { up: 'selected',
                                down: 'down-selected',
                                left: 'left-selected',
                                right: 'right-selected' };
        
        // this.generateFilters();

        // this.moveInstrumentSelect  = this.moveInstrumentSelect.bind(this);
    }

    generateFilters = () => {
        var filterRow = document.getElementById("filter-list");
        for (var i = 0; i < filters.length; i++) {
            const filterName = filters[i];
            var col = document.createElement("div");
            col.className = 'col-3';

            var card = document.createElement("div");
            card.id = filterName;
            card.className = 'card mb-4 shadow-sm instrument-card';

            for (var key in this.currFilterSet){
                // console.log(key);
                // console.log(this.selectedColors[key]);
                if (this.currFilterSet[key] == filterName){
                    card.classList.add(this.selectedColors[key]);
                }
            }

            var para = document.createElement("p");
            para.id = 'instrument-text';
            para.innerText = filterName.charAt(0).toUpperCase() + filterName.slice(1);

            card.appendChild(para);
            col.appendChild(card);
            filterRow.appendChild(col);
        }
    }

    setFilter = (data) => {
        var filterName = data['effect'];
        var triggered = data['selected'];
        
        if (filterName != this.currFilter) {
            var filterCard = document.getElementById(this.currFilter);
            filterCard.classList.remove(this.highlightColors[this.currDirectionToggle]);
            this.currFilter = filterName;
            
            filterCard = document.getElementById(this.currFilter);
            filterCard.classList.add(this.highlightColors[this.currDirectionToggle]);
        }

        if (triggered) {
            var filterCard = document.getElementById(this.selectedFilter);
            filterCard.classList.remove(this.selectedColors[this.currDirectionToggle]);
            this.selectedFilter = filterName;

            this.currFilterSet[this.currDirectionToggle] = this.selectedFilter;

            filterCard = document.getElementById(this.selectedFilter);
            filterCard.classList.add(this.selectedColors[this.currDirectionToggle]);
        }
    }

    setCursor = (data) => {
        var oldDirection = this.currDirectionToggle;

        this.currDirectionToggle = data['toggle'];
        this.selectedFilter = this.currFilterSet[this.currDirectionToggle];

        var filterCard = document.getElementById(this.currFilter);
        filterCard.classList.add(this.highlightColors[this.currDirectionToggle]);
        filterCard.classList.remove(this.highlightColors[oldDirection]);

    }
}

// const fs = new FilterSet();

