const effectNames = ['chorus', 'delay', 'distortion', 'reverb', 'tremolo', 'vibrato', 'panner', 'wah'];
const effectURL = [
    'https://www.imperial.ac.uk/ImageCropToolT4/imageTool/uploaded-images/newseventsimage_1536238974057_mainnews2012_x1.jpg',
    'https://i.redd.it/ac2sg6wlkxu01.jpg',
    'https://i.guim.co.uk/img/media/75035f49bc60f6f6bf2701ff5680adbad50bd21a/0_800_4000_2400/master/4000.jpg?width=300&quality=85&auto=format&fit=max&s=fb1269ced0b7b4a807b8e52920a97f95',
    'https://1843magazine.static-economist.com/sites/default/files/201708_FE_LSD_90-HEADER-V3.jpg',
    'https://beckleyfoundation.org/wp-content/uploads/2016/03/cerebellum-plate-with-watermark_small.jpg',
    'https://render.fineartamerica.com/images/rendered/default/poster/10/8/break/images/artworkimages/medium/1/lsd-omaste-witkowski.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT0fPnwien4cnX1K7Js60F5NsT9i2Hdd6Ozu_iTON1VKn0nAEdJ&usqp=CAU',
    'https://wi-images.condecdn.net/image/q57EEeADyZ0/crop/1620/f/lsd.jpg'
]

const effectDict = {
    'chorus': {
        'frequency': 24,
        'delay': 30,
        'depth': 12,
        'wet': 50}
    , 
    'delay': {
        'delay': 5,
        'feedback': 1,
        'wet': 1
    }, 
    'distortion': {
        'distortion': 1,
        'wet': 1
    }, 
    'reverb': {
        'decay': 's',
        'wet': 1
    }, 
    'tremolo': {
        'frequency': 50,
        'depth': 1,
        'wet': 1
    }, 
    'vibrato': {
        'frequency': 50,
        'depth': 1,
        'wet': 1
    },
    'panner': {
        'frequency': 1
    }, 
    'wah': {
        'q': 1,
    }
}

class EffectSetup {
    constructor () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port);
        // this.firstConnection = fal
        this.socket.on('new effect', (msg) => {
            this.readSocket(msg);
        });

        this.currParam = "";
        this.currEffect = "";
        this.currPercent = 0;
        // this.generateEffectsList();
        // this.highlightEffect();
    }



    readSocket = (value) => {
        // console.log(value);
        const name = value[0];
        const param = value[1];
        if (name != this.currEffect) {
            this.highlightEffect(name);
            document.getElementById("parameters").innerHTML = '';
            // this.generateParameters(name, value[2]);
            // this.highlightParam(param);
        }

        this.generateParameters(name, value[2]);
        this.highlightParam(name, param);
    }


    generateEffectsList = () => {
        var effectsRow = document.getElementById("effects-list");
        var i = 0;
        while (i < 8) {
            const effectName = effectNames[i];
            const foundURL = effectURL[i];
            var col = document.createElement("div");
            col.className = 'col-2';
            col.style.marginBottom = '30px';

            var card = document.createElement("div");
            card.id = effectName;
            card.className = 'card mb-4 shadow-sm instrument-card';
            card.style.backgroundImage = 'url(' + foundURL + ')';
            card.style.backgroundSize = "100%";

            var para = document.createElement("p");
            para.id = 'effect-text';
            para.innerText = effectName.charAt(0).toUpperCase() + effectName.slice(1);

            card.appendChild(para);
            col.appendChild(card);
            // effectsRow.appendChild(col);
            if (i == 0 || i == 4) {
                var newcol = document.createElement("div");
                newcol.className = 'col-2';
                newcol.style.marginBottom = '30px';
                effectsRow.appendChild(newcol);
                effectsRow.appendChild(col);
            } else if (i == 3 || i == 7) {
                var newcol = document.createElement("div");
                newcol.className = 'col-2';
                newcol.style.marginBottom = '30px';
                effectsRow.appendChild(col);
                effectsRow.appendChild(newcol);
            } else {
                effectsRow.appendChild(col);
            }
            i += 1;
        }
    }

    highlightEffect = (effectName) => {
        if (!effectName) {
            return;
        }
        console.log(effectName);
        var instrumentCard = document.getElementById(effectName);
        instrumentCard.classList.add('highlighted');
        if (this.currEffect && this.currEffect != effectName) {
            document.getElementById(this.currEffect).classList.remove('highlighted');
        }
        this.currEffect = effectName;
    }

    highlightParam = (effectName, param) => {
        if (!effectName || !param) {
            return;
        }
        var textID = effectName + " " + param;
        var paramText = document.getElementById(textID);
        paramText.style.fontWeight = "bold";
        if (this.currParam != textID && document.getElementById(this.currParam) != null) {
            document.getElementById(this.currParam).style.fontWeight = 'normal';
        }
        this.currParam = textID;
    }

    generateParameters = (effectName, params) => {
        var parametersRow = document.getElementById('parameters');
        parametersRow.innerHTML = "";
        for (var param in params) {
            const percent = params[param][0] * 100;
            var paramCol = document.createElement("div");
            paramCol.className = 'col-2';
            paramCol.style.marginTop = '10px';
            paramCol.id = effectName + " " + param;
            paramCol.innerText = param + ' (' + Math.round(percent) + '%)';
            parametersRow.appendChild(paramCol)

            var progressCol = document.createElement("div");
            progressCol.className = 'col-8';    
            progressCol.style.marginTop = '15px';
            
            var progressDiv = document.createElement("div");
            progressDiv.className = 'progress';

            var progressBar = '<div class="progress-bar" role="progressbar" style="width: ' 
                + percent + '%;" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100"></div>'
            progressDiv.innerHTML = progressBar;
            progressCol.appendChild(progressDiv);

            parametersRow.appendChild(paramCol);
            parametersRow.appendChild(progressCol);

            var emptyCol = document.createElement("div");
            emptyCol.className = 'col-2';
            parametersRow.appendChild(emptyCol);
        }
    }
}

// const es = new EffectSetup();