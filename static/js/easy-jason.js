//create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth().toMaster();
// var pitchShift = new Tone.PitchShift({
//     pitch: -1,
//     windowSize: 0.1
// }).toMaster();

//play a middle 'C' for the duration of an 8th note
// synth.triggerAttackRelease("C4", "8n");
var box = document.getElementById('box');
box.addEventListener("click", e => {
    synth.triggerAttack('C4');
    console.log('buietch');
})

var count = 0.1
var box1 = document.getElementById('box1');
box1.addEventListener("click", e => {
    synth.disconnect()
    var pitchShift = new Tone.PitchShift({
        pitch: count
        // windowSize: 
    }).toMaster();
    synth.connect(pitchShift);
    count += 0.1;
})