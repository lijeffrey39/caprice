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

function addEffect(args) {
    var effect;

    switch(args['name']) {
        case "chorus":
            // delay in ms
            // depth between 0 - 1
            effect = new Tone.Chorus(args['params']['freq'], args['params']['delay'], args['params']['depth']);
            effect.toMaster();
        case 'delay':
            // delay in secs
            // feedback between 0 - 1
            effect = new Tone.FeedbackDelay(args['params']['delay'], args['params']['feedback']);
            effect.toMaster();
        case "distortion":
            // level between 0 - 1
            effect = new Tone.Distortion(args['params']['level']);
            effect.toMaster();
        case "reverb":
            effect = new Tone.Reverb(args['params']['decay']);
            effect.generate()
                .then(() => effect.toMaster());
        case "tremolo":
            // depth between 0 - 1
            effect = new Tone.Tremelo(args['params']['freq'], args['params']['depth']);
            effect.toMaster().start();
        case "vibrato":
           // depth between 0 - 1
            effect = new Tone.Vibrato(args['params']['freq'], args['params']['depth']);
            effect.toMaster().start();
    }

    effects[effects.length - 1].connect(effect);

    effects.push(effect);
}

function removeEffect(name) {
    var effect;
    switch(name) {
        case "chorus":
            effect = Tone.Chorus;
        case "delay":
            effect = Tone.FeedbackDelay;
        case "distortion":
            effect = Tone.Distortion;
        case "reverb":
            effect = Tone.Reverb;
        case "tremolo":
            effect = Tone.Tremelo;
        case "vibrato":
            effect = Tone.Vibrato;
    }

    for(i = 0; i < effects.length; i++) {
        if(effects[i] instanceof effect) {
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
    frequency: 2,
    depth: 0.5
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
function playNotes(notes, new_swipe) {
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

var dt;

$(document).ready(function() {
         
    // sending a connect request to the server.
    socket = io.connect('http://localhost:5000');
  
    socket.on('after connect', function(msg) {
        console.log('After connect', msg);
    });
  
    socket.on('update value', function(msg) {
        var timer;

        if (JSON.stringify(msg.notes) != JSON.stringify(lastNotes)) {
            dt = new Date();
            timer = true;
        } else {
            timer = false;
        }
        if(msg.effects_toggle) {
            if(msg.effects_toggle.toggle) {
                addEffect(msg.effects_toggle);
            }
            else {
                removeEffect(msg.effects_toggle.name);
            }
        }
        playNotes(msg.notes, msg.new_swipe);
        // if (JSON.stringify(msg.notes) != JSON.stringify(lastNotes)) {
        //     dt = new Date();
        //     console.log(dt.getTime());
        // }
        // $('#' + msg.who).val(msg.data);
    });
  });

pitchShift.connect(vibe);
polysynth.toMaster();
// synth.connect(pitchShift);
// synth.toMaster();
var cMaj = new Set(['C4', 'E4', 'G4']);
var cMaj1 = new Set(['C4', 'E4', 'G#4']);



//play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease("C4", "8n");
var box = document.getElementById('box');
box.addEventListener("click", e => {
    // synth.disconnect();
    // vibe.disconnect();
    // synth.toMaster();
    // synth.triggerAttack('C4');
    // playNotes(cMaj);
    
    socket.emit('notif');
    
})

var count = 1;
var box1 = document.getElementById('box1');
box1.addEventListener("click", e => {
    playNotes(cMaj1);
    // synth.disconnect();
    // synth.connect(vibe);
    // vibe.toMaster();

    // pitchShift.disconnect();
    // pitchShift = new Tone.PitchShift({
    //     pitch: pitchnum+count
    // });
    // synth.connect(pitchShift);
    // console.log(Date.now() - start);

    // setTimeout(() => { 
    //     pitchShift.toMaster(); 
    //     console.log(Date.now() - start);
    // }, release*1000);
    

    // count += 1;
    // synth.setNote("C#4");
    
})