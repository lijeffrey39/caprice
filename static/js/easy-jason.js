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

var panner = new Tone.Panner3D().toMaster();
panner.coneOuterAngle = 70;
panner.coneInnerAngle = 70;
panner.coneOuterGain = 0.3;

// polysynth.connect(panner);

//gyro is dict w keys 'x' 'y' 'z'
function panner_update(gyro) {
    var scale = 0.20;
    
    // panner.setOrientation(
    //     gyro['y'],
    //     0,
    //     0
    // );

    // panner.setPosition(
    //     panner.positionX + scale*gyro['y'], 
    //     panner.positionY, //+ scale*gyro['y'], 
    //     panner.positionZ); //+ scale*gyro['z']);
    panner.setPosition(
        -scale*gyro['y'], 
        0, 
        2);
    
    console.log(panner);
}

var sampler = new Tone.Sampler({
    'C4': "static/Harmonics/C.mp3"
}, function() {
    console.log('yee');
    // sampler.toMaster();
    sampler.triggerAttack('C4');
    sampler.triggerAttack('E4');
    sampler.triggerAttack('G4');

})

function addEffect(args) {
    var effect;
    console.log('yuk')
    switch(args['name']) {
        case "chorus":
            // delay in ms
            // depth between 0 - 1
            effect = new Tone.Chorus(args['params']['freq'], args['params']['delay'], args['params']['depth']);
            effect.toMaster();
            break;
        case 'delay':
            // delay in secs
            // feedback between 0 - 1
            effect = new Tone.FeedbackDelay(args['params']['delay'], args['params']['feedback']);
            effect.toMaster();
            break;
        case "distortion":
            // level between 0 - 1
            effect = new Tone.Distortion(args['params']['level']);
            effect.toMaster();
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

var pitchShift = new Tone.PitchShift({
    pitch: pitchnum
    // windowSize: 
});
var vibe = new Tone.Vibrato({
    frequency: 0,
    depth: 0
});



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
        
        for(i=0; i<lastNotes.size; i++) {
            sampler.triggerRelease(lastNotes_arr[i]);
        }
        for(i=0; i<notes.size; i++) {
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
        synth_playNotes(msg.notes, msg.new_swipe);

        if(msg.gyro != null) {
            panner_update(msg.gyro);
        } else {
            panner.setPosition(0,0,2);
        }
        // if (JSON.stringify(msg.notes) != JSON.stringify(lastNotes)) {
        //     dt = new Date();
        //     console.log(dt.getTime());
        // }
        // $('#' + msg.who).val(msg.data);
    });
  });



polysynth.connect(vibe);
vibe.connect(panner);
panner.toMaster();
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