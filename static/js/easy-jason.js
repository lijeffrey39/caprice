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
var wah = new Tone.Filter({
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
var pannerOn = false;
function panner_update(gyro) {
    var xscale = 0.25;
    var zscale = 0.1;
    
    panner.setPosition(
        -xscale*gyro['y'], 
        0, 
        2 - (Math.min(1.5, zscale*gyro['x'])));
}

function wah_run(gyro) {
    var scale = 40;

    wah.frequency.value = Math.max(100, 4000-scale*gyro['x']);
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
            distortion.wet.value = args['params']['wet']

            break;
        case "reverb":
            // decay in secs
            reverb.decay.value = args['params']['decay'];
            reverb.preDelay.value = args['params']['preDelay'];
            reverb.wet.value = args['params']['wet']

            //have to call this every time params r changed
            reverb.generate();

            break;
        case "tremolo":
            // depth between 0 - 1
            tremolo.frequency.value = args['params']['freq'];
            tremolo.depth.value = args['params']['depth'];
            tremolo.wet.value = args['params']['wet']

            //have to do this everytime something is edited
            tremolo.start();

            break;
        case "vibrato":
            // depth between 0 - 1
            vibe.frequency.value = args['params']['freq'];
            vibe.depth.value = args['params']['depth'];
            vibe.wet.value = args['params']['wet'];
            break;
        case "panner":
            pannerOn = true;
            break;
        case "wah":
            wah.type = "bandpass"
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
            chorus.wet.value = 0;
            break;
        case "delay":
            delay.wet.value = 0;
            break;
        case "distortion":
            distortion.wet.value = 0;
            break;
        case "reverb":
            reverb.wet.value = 0;
            break;
        case "tremolo":
            tremolo.wet.value = 0;
            break;
        case "vibrato":
            vibe.wet.value = 0;
            break;
        case "panner":
            pannerOn = false;
            break;
        case "wah":
            wah.type = "allpass"
            break;
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
            if(pannerOn) {
                panner_update(msg.gyro);
            }
            wah.type = "bandpass";
            wah_run(msg.gyro);
        } else {
            panner.setPosition(0,0,2);
            wah.type = "allpass";
        }
        
    });
  });

var volume = new Tone.Volume(-10);

//set up effects chain
polysynth.connect(wah);
wah.connect(tremolo);
tremolo.connect(vibe);
vibe.connect(distortion);
distortion.connect(chorus);
chorus.connect(delay);
delay.connect(reverb);
reverb.connect(panner);
panner.toMaster();
