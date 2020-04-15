const start = Date.now();

var effects = [];

var pitchnum = 5;
var release = 0.01
//create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth({
    envelope: {
        sustain: 1,
        // decay: 0
        release: release
    }
});

const polysynth = new Tone.PolySynth(4, Tone.Synth);

//panner effect
var panner = new Tone.Panner3D();
panner.coneOuterAngle = 70;
panner.coneInnerAngle = 70;
panner.coneOuterGain = 0.3;

//pitchshift effect
var pitchShift = new Tone.PitchShift({
    pitch : 0,
    windowSize : 0.1,
    delayTime : 0,
    feedback : 0,
    wet: 0
});

// wah effect
var filter = new Tone.Filter({
    type: "allpass",
    frequency: 4000,
    Q: 0.1
});

//chorus
var chorus = new Tone.Chorus({
    frequency : 0,
    delayTime : 3.5 ,
    depth : 0.7 , //0 to 1
    type : "sine" ,
    spread : 180,
    wet: 0, //0 to 1
});

//delay
var delay = new Tone.FeedbackDelay({
    delayTime: 0,
    feedback: 0,
    wet: 0
})

//distortion
var distortion = new Tone.Distortion({
    distortion : 0,
    oversample : 'none',
    wet: 0
})

//reverb
var reverb = new Tone.Reverb({
    decay : 1.5 ,
    preDelay : 0.01,
    wet: 0,
})

//tremolo
var tremolo = new Tone.Tremolo({
    frequency : 10,
    type : "sine",
    depth : 0.5,
    spread : 180,
    wet: 0
})

//vibrato
var vibe = new Tone.Vibrato({
    frequency: 0,
    depth: 0,
    wet: 0
});

//gyro is dict w keys 'x' 'y' 'z'
function panner_update(gyro) {
    var xscale = 0.25;
    var zscale = 0.1;
    
    panner.setPosition(
        -xscale*gyro['y'], 
        0, 
        2 - (Math.min(1.5, zscale*gyro['x'])));
}

function wah(gyro) {
    var scale = 40;

    filter.frequency.value = Math.max(100, 4000-scale*gyro['x']);
}

var sampler = new Tone.Sampler(
    {
    // 'C4': "static/samples/Harmonics/C.mp3"
    'E3': 'static/samples/Cello/E3.[mp3|ogg]',
    'E4': 'static/samples/Cello/E4.[mp3|ogg]',
    'F2': 'static/samples/Cello/F2.[mp3|ogg]',
    'F3': 'static/samples/Cello/F3.[mp3|ogg]',
    'F4': 'static/samples/Cello/F4.[mp3|ogg]',
    'F#3': 'static/samples/Cello/Fs3.[mp3|ogg]',
    'F#4': 'static/samples/Cello/Fs4.[mp3|ogg]',
    'G2': 'static/samples/Cello/G2.[mp3|ogg]',
    'G3': 'static/samples/Cello/G3.[mp3|ogg]',
    'G4': 'static/samples/Cello/G4.[mp3|ogg]',
    'G#2': 'static/samples/Cello/Gs2.[mp3|ogg]',
    'G#3': 'static/samples/Cello/Gs3.[mp3|ogg]',
    'G#4': 'static/samples/Cello/Gs4.[mp3|ogg]',
    'A2': 'static/samples/Cello/A2.[mp3|ogg]',
    'A3': 'static/samples/Cello/A3.[mp3|ogg]',
    'A4': 'static/samples/Cello/A4.[mp3|ogg]',
    'A#2': 'static/samples/Cello/As2.[mp3|ogg]',
    'A#3': 'static/samples/Cello/As3.[mp3|ogg]',
    'A#4': 'static/samples/Cello/As4.[mp3|ogg]',
    'B2': 'static/samples/Cello/B2.[mp3|ogg]',
    'B3': 'static/samples/Cello/B3.[mp3|ogg]',
    'B4': 'static/samples/Cello/B4.[mp3|ogg]',
    'C2': 'static/samples/Cello/C2.[mp3|ogg]',
    'C3': 'static/samples/Cello/C3.[mp3|ogg]',
    'C4': 'static/samples/Cello/C4.[mp3|ogg]',
    'C5': 'static/samples/Cello/C5.[mp3|ogg]',
    'C#3': 'static/samples/Cello/Cs3.[mp3|ogg]',
    'C#4': 'static/samples/Cello/Cs4.[mp3|ogg]',
    'D2': 'static/samples/Cello/D2.[mp3|ogg]',
    'D3': 'static/samples/Cello/D3.[mp3|ogg]',
    'D4': 'static/samples/Cello/D4.[mp3|ogg]',
    'D#2': 'static/samples/Cello/Ds2.[mp3|ogg]',
    'D#3': 'static/samples/Cello/Ds3.[mp3|ogg]',
    'D#4': 'static/samples/Cello/Ds4.[mp3|ogg]',
    'E2': 'static/samples/Cello/E2.[mp3|ogg]'
}
);

function addEffect(args) {
    var effect;
    console.log('yuk')
    switch(args['name']) {
        case "chorus":
            // delay in ms
            // depth between 0 - 1
            chorus.frequency.value = args['params']['freq'];
            chorus.delay.value = args['params']['delay'];
            chorus.depth.value = args['params']['depth'];
            chorus.wet.value = args['params']['wet']
            break;
        case 'delay':
            // delay in secs
            // feedback between 0 - 1
            delay.delay.value = args['params']['delay'];
            delay.feedback.value = args['params']['feedback'];
            delay.wet.value = args['params']['wet']
            break;
        case "distortion":
            // distortion between 0 - 1
            distortion.level.value = args['params']['distortion'];
            distortion.oversample = args['params']['oversample'];
            break;
        case "reverb":
            effect = new Tone.Reverb(args['params']['decay']);
            effect.generate()
                .then(() => effect.toMaster());
            break;
        case "tremolo":
            // depth between 0 - 1
            effect = new Tone.Tremolo(args['params']['freq'], args['params']['depth']);
            effect.toMaster().start();
            break;
        case "vibrato":
           // depth between 0 - 1
            effect = new Tone.Vibrato(args['params']['freq'], args['params']['depth']);
            effect.toMaster().start();
            break;
    }

    if(effects.length == 0) {
        polysynth.disconnect();
        polysynth.connect(effect);
    } else {
        effects[effects.length - 1].connect(effect);
    }

    effects.push(effect);
    effect.toMaster();
}

function removeEffect(name) {
    var effect;
    switch(name) {
        case "chorus":
            effect = Tone.Chorus;
            break;
        case "delay":
            effect = Tone.FeedbackDelay;
            break;
        case "distortion":
            effect = Tone.Distortion;
            break;
        case "reverb":
            effect = Tone.Reverb;
            break;
        case "tremolo":
            effect = Tone.Tremolo;
            break;
        case "vibrato":
            effect = Tone.Vibrato;
            break;
    }

    for(var i = 0; i < effects.length; i++) {
        if(effects[i] instanceof effect) {
            effects[i].disconnect()
            if(i == 0) {
                if(effects.length == 1) {
                    console.log('removed')
                    polysynth.toMaster();
                } else {
                    polysynth.connect(effects[1])
                }
            } else {
                //if removed effect is last one in chain
                if(i == effects.length-1) {
                    effects[effects.length-2].toMaster();
                } else { //if removed effect is in the middle
                    effects[i-1].connect(effects[i+1]);
                }
            }
            effects.pop(i);

            break;
        }
    }

}

//set of current notes being played
var lastNotes = new Set();
var socket;

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

//feed in all notes being played, only the notes that changed
//will reflect in the audio
function synth_playNotes(notes, new_swipe) {
    if(new_swipe) {
        console.log(notes);
        polysynth.triggerRelease(lastNotes);
        polysynth.triggerAttack(notes);
    }
    else if(notes != lastNotes) {
        let newNotes = Array.from(difference(notes, lastNotes));
        let finNotes = Array.from(difference(lastNotes, notes));
        polysynth.triggerRelease(finNotes);
        polysynth.triggerAttack(newNotes);
        // console.log(newNotes);
        // lastNotes = notes;
    }
    lastNotes = notes;
}

//playNotes for samples, works slightly differently than polysynth
function sampler_playNotes(notes, new_swipe) {
    var i;
    var lastNotes_arr = Array.from(lastNotes);
    var notes_arr = Array.from(notes);
    if(new_swipe) {
        console.log(notes);
        
        for(i=0; i<lastNotes.length; i++) {
            sampler.triggerRelease(lastNotes_arr[i]);
        }
        for(i=0; i<notes.length; i++) {
            sampler.triggerAttack(notes_arr[i])
        }
    }
    else if(notes != lastNotes) {
        let newNotes = Array.from(difference(notes, lastNotes));
        let finNotes = Array.from(difference(lastNotes, notes));
        for(i=0; i<finNotes.length; i++) {
            sampler.triggerRelease(finNotes[i]);
        }
        for(i=0; i<newNotes.length; i++) {
            sampler.triggerAttack(newNotes[i]);
        }
    }
    lastNotes = notes;
}

var dt;

$(document).ready(function() {

    // setInterval(() => function() {
    //     panner.setOrientation(panner.orientationX, panner.orientationY,
    //         panner.orientationZ + 0.1);
    // }, 100);
         
    // sending a connect request to the server.
    socket = io.connect('http://localhost:5000');
  
    socket.on('after connect', function(msg) {
        console.log('After connect', msg);
    });
  
    socket.on('update value', function(msg) {
        var timer;

        if("effects_toggle" in msg) {
            if(msg.effects_toggle.toggle) {
                console.log('yup')
                addEffect(msg.effects_toggle);
            }
            else {
                console.log('nope')
                removeEffect(msg.effects_toggle.name);
            }
        }
        // sampler_playNotes(msg.notes, msg.new_swipe);
        synth_playNotes(msg.notes, msg.new_swipe);


        if(msg.gyro != null) {
            panner_update(msg.gyro);
            filter.type = "bandpass";
            wah(msg.gyro);
        } else {
            panner.setPosition(0,0,2);
            filter.type = "allpass";
        }
        
    });
  });

var volume = new Tone.Volume(-10);


polysynth.connect(vibe);
vibe.connect(panner);
panner.toMaster();
// panner.connect(volume)
// volume.toMaster();
// polysynth.toMaster();
var cMaj = new Set(['C4', 'E4', 'G4']);
var cMaj1 = new Set(['G#4']);



//play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease("C4", "8n");
var box = document.getElementById('box');
box.addEventListener("click", e => {
    // synth.disconnect();
    // vibe.disconnect();
    // synth.toMaster();
    // synth.triggerAttack('C4');
    sampler_playNotes(cMaj, false);
    vibe.depth.value = 1;
    vibe.frequency.value = 5;
    
    // socket.emit('bietch');
    
})

var count = 1;
var box1 = document.getElementById('box1');
box1.addEventListener("click", e => {
    sampler_playNotes(cMaj1, false);
    

    // count += 1;
    // synth.setNote("C#4");
    
})