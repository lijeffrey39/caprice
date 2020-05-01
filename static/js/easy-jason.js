const start = Date.now();

var effects = [];

var pitchnum = 5;
var release = 0.01

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
    wet: 1
});

// wah effect
var wah = new Tone.Filter({
    type: "bandpass",
    frequency: 4000,
    Q: 0
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
    distortion : 0.4,
    oversample : 'none',
    wet: 0
})

//reverb
var curDecay = 2;
var reverb = new Tone.Reverb({
    decay : 2 ,
    preDelay : 0.01,
    wet: 0,
})
reverb.generate();

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
        4 - (Math.min(1, zscale*gyro['x'])));
}

function wah_run(gyro) {
    var scale = 40;

    wah.frequency.value = Math.max(100, 4000-scale*gyro['x']);
}

var pitchShiftOn = true;
function bitchshift(gyro) {
    var scale = 0.1;
    var shift;

    if(scale*gyro['x'] > 2){
        shift = 2;
    } else if (scale*gyro['x'] < -2) {
        shift = -2
    } else {
        shift = scale*gyro['x'];
    }

    pitchShift.pitch = shift;
}

var effect_wet = {
    'chorus': 0.4,
    'delay': 0.4,
    'distortion': 0.4,
    'reverb': 0.4,
    'tremolo': 0.4,
    'vibrato': 0.4,
    'wah': 0.4
}

var synth = new Tone.PolySynth(4, Tone.Synth);

// var metalsynth = new Tone.MetalSynth();

var membranesynth = new Tone.MembraneSynth();

var fmsynth = new Tone.PolySynth(4, Tone.FMSynth);

var duosynth = new Tone.PolySynth(4, Tone.DuoSynth);

var amsynth = new Tone.PolySynth(4, Tone.AMSynth);

var sampler = new Tone.Sampler(piano);
var playNotes = sampler_playNotes;
function setInstrument(ins) {
    switch(ins){
        case "cello":
            sampler = new Tone.Sampler(cello);
            playNotes = sampler_playNotes;
            break;
        case "bass":
            sampler = new Tone.Sampler(bass);
            playNotes = sampler_playNotes;
            break;
        case "bassoon":
            sampler = new Tone.Sampler(bassoon);
            playNotes = sampler_playNotes;
            break;
        case "clarinet":
            sampler = new Tone.Sampler(clarinet);
            playNotes = sampler_playNotes;
            break;
        case "contrabass":
            sampler = new Tone.Sampler(contrabass);
            playNotes = sampler_playNotes;
            break;
        case "flute":
            sampler = new Tone.Sampler(flute);
            playNotes = sampler_playNotes;
            break;
        case "french horn":
            sampler = new Tone.Sampler(french_horn);
            playNotes = sampler_playNotes;
            break;
        case "acoustic guitar":
            sampler = new Tone.Sampler(acoustic_guitar);
            playNotes = sampler_playNotes;
            break;
        case "electric guitar":
            sampler = new Tone.Sampler(electric_guitar);
            playNotes = sampler_playNotes;
            break;
        case "classical guitar":
            sampler = new Tone.Sampler(nylon_guitar);
            playNotes = sampler_playNotes;
            break;
        case "harmonium":
            sampler = new Tone.Sampler(harmonium);
            playNotes = sampler_playNotes;
            break;
        case "harp":
            sampler = new Tone.Sampler(harp);
            playNotes = sampler_playNotes;
            break;
        case "organ":
            sampler = new Tone.Sampler(organ);
            playNotes = sampler_playNotes;
            break;
        case "piano":
            sampler = new Tone.Sampler(piano);
            playNotes = sampler_playNotes;
            break;
        case "saxophone":
            sampler = new Tone.Sampler(saxophone);
            playNotes = sampler_playNotes;
            break;
        case "trombone":
            sampler = new Tone.Sampler(trombone);
            playNotes = sampler_playNotes;
            break;
        case "trumpet":
            sampler = new Tone.Sampler(trumpet);
            playNotes = sampler_playNotes;
            break;
        case "tuba":
            sampler = new Tone.Sampler(tuba);
            playNotes = sampler_playNotes;
            break;
        case "violin":
            sampler = new Tone.Sampler(violin);
            playNotes = sampler_playNotes;
            break;
        case "xylophone":
            sampler = new Tone.Sampler(xylophone);
            playNotes = sampler_playNotes;
            break;
        case "synth":
            sampler = synth;
            playNotes = synth_playNotes;
            break;
        case "membranesynth":
            sampler = membranesynth;
            playNotes = synth_playNotes;
            break;
        case "fmsynth":
            sampler = fmsynth;
            playNotes = synth_playNotes;
            break;
        case "duosynth":
            sampler = duosynth;
            playNotes = synth_playNotes;
            break;
        case "amsynth":
            sampler = amsynth;
            playNotes = synth_playNotes;
            break;
    }
    sampler.connect(pitchShift);
}

function changeEffect(args) {
    switch(args[0]) {
        case "chorus":
            chorus.frequency.value = args[2]['frequency'][1];
            chorus.delay = args[2]['delay'][1];
            chorus.depth = args[2]['depth'][1];
            effect_wet['chorus'] = args[2]['wet'][1];
            break;
        case "delay":
            delay.delay = args[2]['delay'];
            delay.feedback.value = args[2]['feedback'][1];
            effect_wet['delay'] = args[2]['wet'][1];
            break;
        case "distortion":
            distortion.distortion = args[2]['distortion'][1];
            effect_wet['distortion'] = args[2]['wet'][1];
            break;
        case 'reverb':
            reverb.decay = args[2]['decay'][1];
            effect_wet['reverb'] = args[2]['wet'][1]
            break;
        case 'tremolo':
            tremolo.frequency.value = args[2]['frequency'][1];
            tremolo.depth.value = args[2]['depth'][1];
            effect_wet['tremolo'] = args[2]['wet'][1];
            break;
        case 'vibrato':
            vibe.frequency.value = args[2]['frequency'][1];
            vibe.depth.value = args[2]['depth'][1];
            effect_wet['vibrato'] = args[2]['wet'][1];
            break;
        case 'panner':
            console.log('bieth');
            break;
        case 'wah':
            effect_wet['wah'] = args[2]['q'][1];
            break;
        case 'pitchshift':
            pitchShift.delayTime.value = args[2]['delayTime'][1];
            pitchShift.feedback.value = args[2]['feedback'][1];
            break;
    }
}

function addEffect(args) {
    var effect;
    console.log('yuk')
    switch(args['name']) {
        case "chorus":
            chorus.wet.value = effect_wet['chorus'];
            break;
        case 'delay':
            delay.wet.value = effect_wet['delay'];
            break;
        case "distortion":
            distortion.wet.value = effect_wet['distortion'];
            break;
        case "reverb":
            reverb.wet.value = effect_wet['reverb'];
            //have to call this every time params r changed
            reverb.generate();
            break;
        case "tremolo":
            tremolo.wet.value = effect_wet['tremolo'];
            //have to do this everytime something is edited
            tremolo.start();
            break;
        case "vibrato":
            // depth between 0 - 1
            vibe.wet.value = effect_wet['vibrato'];
            break;
        case "panner":
            pannerOn = true;
            break;
        case "wah":
            wah.Q.value = effect_wet['wah'];
            break;
        case 'pitchshift':
            pitchShiftOn = true;
            break;
    }
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
            wah.Q.value = 0;
            break;
        case "pitchshift":
            pitchShiftOn = false;
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
        sampler.triggerRelease(lastNotes);
        sampler.triggerAttack(notes);
    }
    else if(notes != lastNotes) {
        let newNotes = Array.from(difference(notes, lastNotes));
        let finNotes = Array.from(difference(lastNotes, notes));
        sampler.triggerRelease(finNotes);
        sampler.triggerAttack(newNotes);
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
         
    // sending a connect request to the server.
    socket = io.connect('http://localhost:5000');
  
    socket.on('after connect', function(msg) {
        console.log('After connect', msg);
    });

    socket.on('instrument', function(msg) {
        console.log(msg.instrument)
        var instrument = msg.instrument.toLowerCase();
        setInstrument(instrument);
    });

    socket.on('effects tune', function(msg) {
        changeEffect(msg);
    });

    socket.on('update notes', function(msg) {
        playNotes(msg.notes, false);
    });
  
    socket.on('update value', function(msg) {
        var timer;

        if ("effects_toggle" in msg) {
            if(msg.effects_toggle.toggle) {
                // console.log('yup')
                addEffect(msg.effects_toggle);
            }
            else {
                // console.log('nope')
                removeEffect(msg.effects_toggle.name);
            }
        }
        // if(msg.new_swipe){
        //     if(msg.time){
        //         var d = new Date();
        //         var t = d.getTime();
        //         console.log(t-msg.time);
        //     }

        // }
        // sampler_playNotes(msg.notes, msg.new_swipe);
        playNotes(lastNotes, msg.new_swipe);

        if (msg.gyro != null) {
            if(pannerOn) {
                panner_update(msg.gyro);
            }
            if(pitchShiftOn) {
                bitchshift(msg.gyro)
            }
            wah_run(msg.gyro);
        } else {
            panner.setPosition(0,0,4);
            pitchShift.pitch = 0;
        }
        
    });
  });

//set up effects chain
sampler.connect(pitchShift);
pitchShift.connect(wah);
wah.connect(tremolo);
tremolo.connect(vibe);
vibe.connect(distortion);
distortion.connect(chorus);
chorus.connect(delay);
delay.connect(reverb);
reverb.connect(panner);
panner.toMaster();
