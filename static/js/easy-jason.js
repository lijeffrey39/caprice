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
    wet: 0
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
    wet: 0.6,
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
    wet: 1
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

function reverb_run(gyro) {
    var scale = 0.1;

    reverb.decay.value = curDecay + Math.abs(scale*gyro['x']);
}

var effect_wet = {
    'chorus': 0,
    'delay': 0,
    'distortion': 0,
    'reverb': 0,
    'tremolo': 0,
    'vibrato': 0,
    'wah': 0
}

var cello = new Tone.Sampler(
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
});

var bass = new Tone.Sampler({
    'A#2': 'static/samples/bass-electric/As2.[mp3|ogg]',
    'A#3': 'static/samples/bass-electric/As3.[mp3|ogg]',
    'A#4': 'static/samples/bass-electric/As4.[mp3|ogg]',
    'A#5': 'static/samples/bass-electric/As5.[mp3|ogg]',
    'C#2': 'static/samples/bass-electric/Cs2.[mp3|ogg]',
    'C#3': 'static/samples/bass-electric/Cs3.[mp3|ogg]',
    'C#4': 'static/samples/bass-electric/Cs4.[mp3|ogg]',
    'C#5': 'static/samples/bass-electric/Cs5.[mp3|ogg]',
    'E2': 'static/samples/bass-electric/E2.[mp3|ogg]',
    'E3': 'static/samples/bass-electric/E3.[mp3|ogg]',
    'E4': 'static/samples/bass-electric/E4.[mp3|ogg]',
    'E5': 'static/samples/bass-electric/E5.[mp3|ogg]',
    'G2': 'static/samples/bass-electric/G2.[mp3|ogg]',
    'G3': 'static/samples/bass-electric/G3.[mp3|ogg]',
    'G4': 'static/samples/bass-electric/G4.[mp3|ogg]',
    'G5': 'static/samples/bass-electric/G5.[mp3|ogg]'
});

var bassoon = new Tone.Sampler({
    'A3': 'static/samples/bassoon/A3.[mp3|ogg]',
    'C2': 'static/samples/bassoon/C2.[mp3|ogg]',
    'C3': 'static/samples/bassoon/C3.[mp3|ogg]',
    'C4': 'static/samples/bassoon/C4.[mp3|ogg]',
    'E3': 'static/samples/bassoon/E3.[mp3|ogg]',
    'G1': 'static/samples/bassoon/G1.[mp3|ogg]',
    'G2': 'static/samples/bassoon/G2.[mp3|ogg]',
    'G3': 'static/samples/bassoon/G3.[mp3|ogg]',
    'A1': 'static/samples/bassoon/A1.[mp3|ogg]',
    'A2': 'static/samples/bassoon/A2.[mp3|ogg]'
})

var clarinet = new Tone.Sampler({
    'D3': 'static/samples/clarinet/D3.[mp3|ogg]',
    'D4': 'static/samples/clarinet/D4.[mp3|ogg]',
    'D5': 'static/samples/clarinet/D5.[mp3|ogg]',
    'F2': 'static/samples/clarinet/F2.[mp3|ogg]',
    'F3': 'static/samples/clarinet/F3.[mp3|ogg]',
    'F4': 'static/samples/clarinet/F4.[mp3|ogg]',
    'F#5': 'static/samples/clarinet/Fs5.[mp3|ogg]',
    'A#2': 'static/samples/clarinet/As2.[mp3|ogg]',
    'A#3': 'static/samples/clarinet/As3.[mp3|ogg]',
    'A#4': 'static/samples/clarinet/As4.[mp3|ogg]',
    'D2': 'static/samples/clarinet/D2.[mp3|ogg]'
})

var contrabass = new Tone.Sampler({
    'C1': 'static/samples/contrabass/C1.[mp3|ogg]',
    'C#2': 'static/samples/contrabass/Cs2.[mp3|ogg]',
    'D1': 'static/samples/contrabass/D1.[mp3|ogg]',
    'E1': 'static/samples/contrabass/E1.[mp3|ogg]',
    'E2': 'static/samples/contrabass/E2.[mp3|ogg]',
    'F#0': 'static/samples/contrabass/Fs0.[mp3|ogg]',
    'F#1': 'static/samples/contrabass/Fs1.[mp3|ogg]',
    'G0': 'static/samples/contrabass/G0.[mp3|ogg]',
    'G#1': 'static/samples/contrabass/Gs1.[mp3|ogg]',
    'G#2': 'static/samples/contrabass/Gs2.[mp3|ogg]',
    'A1': 'static/samples/contrabass/A1.[mp3|ogg]',
    'A#0': 'static/samples/contrabass/As0.[mp3|ogg]',
    'B2': 'static/samples/contrabass/B2.[mp3|ogg]'
})

var flute = new Tone.Sampler({
    'A5': 'static/samples/flute/A5.[mp3|ogg]',
    'C3': 'static/samples/flute/C3.[mp3|ogg]',
    'C4': 'static/samples/flute/C4.[mp3|ogg]',
    'C5': 'static/samples/flute/C5.[mp3|ogg]',
    'C6': 'static/samples/flute/C6.[mp3|ogg]',
    'E3': 'static/samples/flute/E3.[mp3|ogg]',
    'E4': 'static/samples/flute/E4.[mp3|ogg]',
    'E5': 'static/samples/flute/E5.[mp3|ogg]',
    'A3': 'static/samples/flute/A3.[mp3|ogg]',
    'A4': 'static/samples/flute/A4.[mp3|ogg]'
})

var french_horn = new Tone.Sampler({
    'D2': 'static/samples/french-horn/D2.[mp3|ogg]',
    'D4': 'static/samples/french-horn/D4.[mp3|ogg]',
    'D#1': 'static/samples/french-horn/Ds1.[mp3|ogg]',
    'F2': 'static/samples/french-horn/F2.[mp3|ogg]',
    'F4': 'static/samples/french-horn/F4.[mp3|ogg]',
    'G1': 'static/samples/french-horn/G1.[mp3|ogg]',
    'A0': 'static/samples/french-horn/A0.[mp3|ogg]',
    'A2': 'static/samples/french-horn/A2.[mp3|ogg]',
    'C1': 'static/samples/french-horn/C1.[mp3|ogg]',
    'C3': 'static/samples/french-horn/C3.[mp3|ogg]',
})

var acoustic_guitar = new Tone.Sampler({
    'F3': 'static/samples/guitar-acoustic/F3.[mp3|ogg]',
    'F#1': 'static/samples/guitar-acoustic/Fs1.[mp3|ogg]',
    'F#2': 'static/samples/guitar-acoustic/Fs2.[mp3|ogg]',
    'F#3': 'static/samples/guitar-acoustic/Fs3.[mp3|ogg]',
    'G1': 'static/samples/guitar-acoustic/G1.[mp3|ogg]',
    'G2': 'static/samples/guitar-acoustic/G2.[mp3|ogg]',
    'G3': 'static/samples/guitar-acoustic/G3.[mp3|ogg]',
    'G#1': 'static/samples/guitar-acoustic/Gs1.[mp3|ogg]',
    'G#2': 'static/samples/guitar-acoustic/Gs2.[mp3|ogg]',
    'G#3': 'static/samples/guitar-acoustic/Gs3.[mp3|ogg]',
    'A1': 'static/samples/guitar-acoustic/A1.[mp3|ogg]',
    'A2': 'static/samples/guitar-acoustic/A2.[mp3|ogg]',
    'A3': 'static/samples/guitar-acoustic/A3.[mp3|ogg]',
    'A#1': 'static/samples/guitar-acoustic/As1.[mp3|ogg]',
    'A#2': 'static/samples/guitar-acoustic/As2.[mp3|ogg]',
    'A#3': 'static/samples/guitar-acoustic/As3.[mp3|ogg]',
    'B1': 'static/samples/guitar-acoustic/B1.[mp3|ogg]',
    'B2': 'static/samples/guitar-acoustic/B2.[mp3|ogg]',
    'B3': 'static/samples/guitar-acoustic/B3.[mp3|ogg]',
    'C2': 'static/samples/guitar-acoustic/C2.[mp3|ogg]',
    'C3': 'static/samples/guitar-acoustic/C3.[mp3|ogg]',
    'C4': 'static/samples/guitar-acoustic/C4.[mp3|ogg]',
    'C#2': 'static/samples/guitar-acoustic/Cs2.[mp3|ogg]',
    'C#3': 'static/samples/guitar-acoustic/Cs3.[mp3|ogg]',
    'C#4': 'static/samples/guitar-acoustic/Cs4.[mp3|ogg]',
    'D1': 'static/samples/guitar-acoustic/D1.[mp3|ogg]',
    'D2': 'static/samples/guitar-acoustic/D2.[mp3|ogg]',
    'D3': 'static/samples/guitar-acoustic/D3.[mp3|ogg]',
    'D4': 'static/samples/guitar-acoustic/D4.[mp3|ogg]',
    'D#1': 'static/samples/guitar-acoustic/Ds1.[mp3|ogg]',
    'D#2': 'static/samples/guitar-acoustic/Ds2.[mp3|ogg]',
    'D#3': 'static/samples/guitar-acoustic/Ds3.[mp3|ogg]',
    'E1': 'static/samples/guitar-acoustic/E1.[mp3|ogg]',
    'E2': 'static/samples/guitar-acoustic/E2.[mp3|ogg]',
    'E3': 'static/samples/guitar-acoustic/E3.[mp3|ogg]',
    'F1': 'static/samples/guitar-acoustic/F1.[mp3|ogg]',
    'F2': 'static/samples/guitar-acoustic/F2.[mp3|ogg]'
})

var electric_guitar = new Tone.Sampler({
    'D#3': 'static/samples/guitar-electric/Ds3.[mp3|ogg]',
    'D#4': 'static/samples/guitar-electric/Ds4.[mp3|ogg]',
    'D#5': 'static/samples/guitar-electric/Ds5.[mp3|ogg]',
    'E2': 'static/samples/guitar-electric/E2.[mp3|ogg]',
    'F#2': 'static/samples/guitar-electric/Fs2.[mp3|ogg]',
    'F#3': 'static/samples/guitar-electric/Fs3.[mp3|ogg]',
    'F#4': 'static/samples/guitar-electric/Fs4.[mp3|ogg]',
    'F#5': 'static/samples/guitar-electric/Fs5.[mp3|ogg]',
    'A2': 'static/samples/guitar-electric/A2.[mp3|ogg]',
    'A3': 'static/samples/guitar-electric/A3.[mp3|ogg]',
    'A4': 'static/samples/guitar-electric/A4.[mp3|ogg]',
    'A5': 'static/samples/guitar-electric/A5.[mp3|ogg]',
    'C3': 'static/samples/guitar-electric/C3.[mp3|ogg]',
    'C4': 'static/samples/guitar-electric/C4.[mp3|ogg]',
    'C5': 'static/samples/guitar-electric/C5.[mp3|ogg]',
    'C6': 'static/samples/guitar-electric/C6.[mp3|ogg]',
    'C#2': 'static/samples/guitar-electric/Cs2.[mp3|ogg]'
})

var nylon_guitar = new Tone.Sampler({
    'F#2': 'static/samples/guitar-nylon/Fs2.[mp3|ogg]',
    'F#3': 'static/samples/guitar-nylon/Fs3.[mp3|ogg]',
    'F#4': 'static/samples/guitar-nylon/Fs4.[mp3|ogg]',
    'F#5': 'static/samples/guitar-nylon/Fs5.[mp3|ogg]',
    'G3': 'static/samples/guitar-nylon/G3.[mp3|ogg]',
    'G5': 'static/samples/guitar-nylon/G3.[mp3|ogg]',
    'G#2': 'static/samples/guitar-nylon/Gs2.[mp3|ogg]',
    'G#4': 'static/samples/guitar-nylon/Gs4.[mp3|ogg]',
    'G#5': 'static/samples/guitar-nylon/Gs5.[mp3|ogg]',
    'A2': 'static/samples/guitar-nylon/A2.[mp3|ogg]',
    'A3': 'static/samples/guitar-nylon/A3.[mp3|ogg]',
    'A4': 'static/samples/guitar-nylon/A4.[mp3|ogg]',
    'A5': 'static/samples/guitar-nylon/A5.[mp3|ogg]',
    'A#5': 'static/samples/guitar-nylon/As5.[mp3|ogg]',
    'B1': 'static/samples/guitar-nylon/B1.[mp3|ogg]',
    'B2': 'static/samples/guitar-nylon/B2.[mp3|ogg]',
    'B3': 'static/samples/guitar-nylon/B3.[mp3|ogg]',
    'B4': 'static/samples/guitar-nylon/B4.[mp3|ogg]',
    'C#3': 'static/samples/guitar-nylon/Cs3.[mp3|ogg]',
    'C#4': 'static/samples/guitar-nylon/Cs4.[mp3|ogg]',
    'C#5': 'static/samples/guitar-nylon/Cs5.[mp3|ogg]',
    'D2': 'static/samples/guitar-nylon/D2.[mp3|ogg]',
    'D3': 'static/samples/guitar-nylon/D3.[mp3|ogg]',
    'D5': 'static/samples/guitar-nylon/D5.[mp3|ogg]',
    'D#4': 'static/samples/guitar-nylon/Ds4.[mp3|ogg]',
    'E2': 'static/samples/guitar-nylon/E2.[mp3|ogg]',
    'E3': 'static/samples/guitar-nylon/E3.[mp3|ogg]',
    'E4': 'static/samples/guitar-nylon/E4.[mp3|ogg]',
    'E5': 'static/samples/guitar-nylon/E5.[mp3|ogg]'
})

var harmonium = new Tone.Sampler({
    'C2': 'static/samples/harmonium/C2.[mp3|ogg]',
    'C3': 'static/samples/harmonium/C3.[mp3|ogg]',
    'C4': 'static/samples/harmonium/C4.[mp3|ogg]',
    'C5': 'static/samples/harmonium/C5.[mp3|ogg]',
    'C#2': 'static/samples/harmonium/Cs2.[mp3|ogg]',
    'C#3': 'static/samples/harmonium/Cs3.[mp3|ogg]',
    'C#4': 'static/samples/harmonium/Cs4.[mp3|ogg]',
    'C#5': 'static/samples/harmonium/Cs5.[mp3|ogg]',
    'D2': 'static/samples/harmonium/D2.[mp3|ogg]',
    'D3': 'static/samples/harmonium/D3.[mp3|ogg]',
    'D4': 'static/samples/harmonium/D4.[mp3|ogg]',
    'D5': 'static/samples/harmonium/D5.[mp3|ogg]',
    'D#2': 'static/samples/harmonium/Ds2.[mp3|ogg]',
    'D#3': 'static/samples/harmonium/Ds3.[mp3|ogg]',
    'D#4': 'static/samples/harmonium/Ds4.[mp3|ogg]',
    'E2': 'static/samples/harmonium/E2.[mp3|ogg]',
    'E3': 'static/samples/harmonium/E3.[mp3|ogg]',
    'E4': 'static/samples/harmonium/E4.[mp3|ogg]',
    'F2': 'static/samples/harmonium/F2.[mp3|ogg]',
    'F3': 'static/samples/harmonium/F3.[mp3|ogg]',
    'F4': 'static/samples/harmonium/F4.[mp3|ogg]',
    'F#2': 'static/samples/harmonium/Fs2.[mp3|ogg]',
    'F#3': 'static/samples/harmonium/Fs3.[mp3|ogg]',
    'G2': 'static/samples/harmonium/G2.[mp3|ogg]',
    'G3': 'static/samples/harmonium/G3.[mp3|ogg]',
    'G4': 'static/samples/harmonium/G4.[mp3|ogg]',
    'G#2': 'static/samples/harmonium/Gs2.[mp3|ogg]',
    'G#3': 'static/samples/harmonium/Gs3.[mp3|ogg]',
    'G#4': 'static/samples/harmonium/Gs4.[mp3|ogg]',
    'A2': 'static/samples/harmonium/A2.[mp3|ogg]',
    'A3': 'static/samples/harmonium/A3.[mp3|ogg]',
    'A4': 'static/samples/harmonium/A4.[mp3|ogg]',
    'A#2': 'static/samples/harmonium/As2.[mp3|ogg]',
    'A#3': 'static/samples/harmonium/As3.[mp3|ogg]',
    'A#4': 'static/samples/harmonium/As4.[mp3|ogg]'
})

var harp = new Tone.Sampler({
    'C5': 'static/samples/harp/C5.[mp3|ogg]',
    'D2': 'static/samples/harp/D2.[mp3|ogg]',
    'D4': 'static/samples/harp/D4.[mp3|ogg]',
    'D6': 'static/samples/harp/D6.[mp3|ogg]',
    'D7': 'static/samples/harp/D7.[mp3|ogg]',
    'E1': 'static/samples/harp/E1.[mp3|ogg]',
    'E3': 'static/samples/harp/E3.[mp3|ogg]',
    'E5': 'static/samples/harp/E5.[mp3|ogg]',
    'F2': 'static/samples/harp/F2.[mp3|ogg]',
    'F4': 'static/samples/harp/F4.[mp3|ogg]',
    'F6': 'static/samples/harp/F6.[mp3|ogg]',
    'F7': 'static/samples/harp/F7.[mp3|ogg]',
    'G1': 'static/samples/harp/G1.[mp3|ogg]',
    'G3': 'static/samples/harp/G3.[mp3|ogg]',
    'G5': 'static/samples/harp/G5.[mp3|ogg]',
    'A2': 'static/samples/harp/A2.[mp3|ogg]',
    'A4': 'static/samples/harp/A4.[mp3|ogg]',
    'A6': 'static/samples/harp/A6.[mp3|ogg]',
    'B1': 'static/samples/harp/B1.[mp3|ogg]',
    'B3': 'static/samples/harp/B3.[mp3|ogg]',
    'B5': 'static/samples/harp/B5.[mp3|ogg]',
    'B6': 'static/samples/harp/B6.[mp3|ogg]',
    'C3': 'static/samples/harp/C3.[mp3|ogg]'
})

var organ = new Tone.Sampler({
    'C3': 'static/samples/organ/C3.[mp3|ogg]',
    'C4': 'static/samples/organ/C4.[mp3|ogg]',
    'C5': 'static/samples/organ/C5.[mp3|ogg]',
    'C6': 'static/samples/organ/C6.[mp3|ogg]',
    'D#1': 'static/samples/organ/Ds1.[mp3|ogg]',
    'D#2': 'static/samples/organ/Ds2.[mp3|ogg]',
    'D#3': 'static/samples/organ/Ds3.[mp3|ogg]',
    'D#4': 'static/samples/organ/Ds4.[mp3|ogg]',
    'D#5': 'static/samples/organ/Ds5.[mp3|ogg]',
    'F#1': 'static/samples/organ/Fs1.[mp3|ogg]',
    'F#2': 'static/samples/organ/Fs2.[mp3|ogg]',
    'F#3': 'static/samples/organ/Fs3.[mp3|ogg]',
    'F#4': 'static/samples/organ/Fs4.[mp3|ogg]',
    'F#5': 'static/samples/organ/Fs5.[mp3|ogg]',
    'A1': 'static/samples/organ/A1.[mp3|ogg]',
    'A2': 'static/samples/organ/A2.[mp3|ogg]',
    'A3': 'static/samples/organ/A3.[mp3|ogg]',
    'A4': 'static/samples/organ/A4.[mp3|ogg]',
    'A5': 'static/samples/organ/A5.[mp3|ogg]',
    'C1': 'static/samples/organ/C1.[mp3|ogg]',
    'C2': 'static/samples/organ/C2.[mp3|ogg]'
})

var piano = new Tone.Sampler({
    'A0': 'static/samples/piano/A0.[mp3|ogg]',
    'A1': 'static/samples/piano/A1.[mp3|ogg]',
    'A2': 'static/samples/piano/A2.[mp3|ogg]',
    'A3': 'static/samples/piano/A3.[mp3|ogg]',
    'A4': 'static/samples/piano/A4.[mp3|ogg]',
    'A5': 'static/samples/piano/A5.[mp3|ogg]',
    'A6': 'static/samples/piano/A6.[mp3|ogg]',
    'A#0': 'static/samples/piano/As0.[mp3|ogg]',
    'A#1': 'static/samples/piano/As1.[mp3|ogg]',
    'A#2': 'static/samples/piano/As2.[mp3|ogg]',
    'A#3': 'static/samples/piano/As3.[mp3|ogg]',
    'A#4': 'static/samples/piano/As4.[mp3|ogg]',
    'A#5': 'static/samples/piano/As5.[mp3|ogg]',
    'A#6': 'static/samples/piano/As6.[mp3|ogg]',
    'B0': 'static/samples/piano/B0.[mp3|ogg]',
    'B1': 'static/samples/piano/B1.[mp3|ogg]',
    'B2': 'static/samples/piano/B2.[mp3|ogg]',
    'B3': 'static/samples/piano/B3.[mp3|ogg]',
    'B4': 'static/samples/piano/B4.[mp3|ogg]',
    'B5': 'static/samples/piano/B5.[mp3|ogg]',
    'B6': 'static/samples/piano/B6.[mp3|ogg]',
    'C0': 'static/samples/piano/C0.[mp3|ogg]',
    'C1': 'static/samples/piano/C1.[mp3|ogg]',
    'C2': 'static/samples/piano/C2.[mp3|ogg]',
    'C3': 'static/samples/piano/C3.[mp3|ogg]',
    'C4': 'static/samples/piano/C4.[mp3|ogg]',
    'C5': 'static/samples/piano/C5.[mp3|ogg]',
    'C6': 'static/samples/piano/C6.[mp3|ogg]',
    'C7': 'static/samples/piano/C7.[mp3|ogg]',
    'C#0': 'static/samples/piano/Cs0.[mp3|ogg]',
    'C#1': 'static/samples/piano/Cs1.[mp3|ogg]',
    'C#2': 'static/samples/piano/Cs2.[mp3|ogg]',
    'C#3': 'static/samples/piano/Cs3.[mp3|ogg]',
    'C#4': 'static/samples/piano/Cs4.[mp3|ogg]',
    'C#5': 'static/samples/piano/Cs5.[mp3|ogg]',
    'C#6': 'static/samples/piano/Cs6.[mp3|ogg]',
    'D0': 'static/samples/piano/D0.[mp3|ogg]',
    'D1': 'static/samples/piano/D1.[mp3|ogg]',
    'D2': 'static/samples/piano/D2.[mp3|ogg]',
    'D3': 'static/samples/piano/D3.[mp3|ogg]',
    'D4': 'static/samples/piano/D4.[mp3|ogg]',
    'D5': 'static/samples/piano/D5.[mp3|ogg]',
    'D6': 'static/samples/piano/D6.[mp3|ogg]',
    'D#0': 'static/samples/piano/Ds0.[mp3|ogg]',
    'D#1': 'static/samples/piano/Ds1.[mp3|ogg]',
    'D#2': 'static/samples/piano/Ds2.[mp3|ogg]',
    'D#3': 'static/samples/piano/Ds3.[mp3|ogg]',
    'D#4': 'static/samples/piano/Ds4.[mp3|ogg]',
    'D#5': 'static/samples/piano/Ds5.[mp3|ogg]',
    'D#6': 'static/samples/piano/Ds6.[mp3|ogg]',
    'E0': 'static/samples/piano/E0.[mp3|ogg]',
    'E1': 'static/samples/piano/E1.[mp3|ogg]',
    'E2': 'static/samples/piano/E2.[mp3|ogg]',
    'E3': 'static/samples/piano/E3.[mp3|ogg]',
    'E4': 'static/samples/piano/E4.[mp3|ogg]',
    'E5': 'static/samples/piano/E5.[mp3|ogg]',
    'E6': 'static/samples/piano/E6.[mp3|ogg]',
    'F0': 'static/samples/piano/F0.[mp3|ogg]',
    'F1': 'static/samples/piano/F1.[mp3|ogg]',
    'F2': 'static/samples/piano/F2.[mp3|ogg]',
    'F3': 'static/samples/piano/F3.[mp3|ogg]',
    'F4': 'static/samples/piano/F4.[mp3|ogg]',
    'F5': 'static/samples/piano/F5.[mp3|ogg]',
    'F6': 'static/samples/piano/F6.[mp3|ogg]',
    'F#0': 'static/samples/piano/Fs0.[mp3|ogg]',
    'F#1': 'static/samples/piano/Fs1.[mp3|ogg]',
    'F#2': 'static/samples/piano/Fs2.[mp3|ogg]',
    'F#3': 'static/samples/piano/Fs3.[mp3|ogg]',
    'F#4': 'static/samples/piano/Fs4.[mp3|ogg]',
    'F#5': 'static/samples/piano/Fs5.[mp3|ogg]',
    'F#6': 'static/samples/piano/Fs6.[mp3|ogg]',
    'G0': 'static/samples/piano/G0.[mp3|ogg]',
    'G1': 'static/samples/piano/G1.[mp3|ogg]',
    'G2': 'static/samples/piano/G2.[mp3|ogg]',
    'G3': 'static/samples/piano/G3.[mp3|ogg]',
    'G4': 'static/samples/piano/G4.[mp3|ogg]',
    'G5': 'static/samples/piano/G5.[mp3|ogg]',
    'G6': 'static/samples/piano/G6.[mp3|ogg]',
    'G#0': 'static/samples/piano/Gs0.[mp3|ogg]',
    'G#1': 'static/samples/piano/Gs1.[mp3|ogg]',
    'G#2': 'static/samples/piano/Gs2.[mp3|ogg]',
    'G#3': 'static/samples/piano/Gs3.[mp3|ogg]',
    'G#4': 'static/samples/piano/Gs4.[mp3|ogg]',
    'G#5': 'static/samples/piano/Gs5.[mp3|ogg]',
    'G#6': 'static/samples/piano/Gs6.[mp3|ogg]'
})

var saxophone = new Tone.Sampler({
    'D#4': 'static/samples/saxophone/Ds4.[mp3|ogg]',
    'E2': 'static/samples/saxophone/E2.[mp3|ogg]',
    'E3': 'static/samples/saxophone/E3.[mp3|ogg]',
    'E4': 'static/samples/saxophone/E4.[mp3|ogg]',
    'F2': 'static/samples/saxophone/F2.[mp3|ogg]',
    'F3': 'static/samples/saxophone/F3.[mp3|ogg]',
    'F4': 'static/samples/saxophone/F4.[mp3|ogg]',
    'F#2': 'static/samples/saxophone/Fs2.[mp3|ogg]',
    'F#3': 'static/samples/saxophone/Fs3.[mp3|ogg]',
    'F#4': 'static/samples/saxophone/Fs4.[mp3|ogg]',
    'G2': 'static/samples/saxophone/G2.[mp3|ogg]',
    'G3': 'static/samples/saxophone/G3.[mp3|ogg]',
    'G4': 'static/samples/saxophone/G4.[mp3|ogg]',
    'G#2': 'static/samples/saxophone/Gs2.[mp3|ogg]',
    'G#3': 'static/samples/saxophone/Gs3.[mp3|ogg]',
    'G#4': 'static/samples/saxophone/Gs4.[mp3|ogg]',
    'A3': 'static/samples/saxophone/A3.[mp3|ogg]',
    'A4': 'static/samples/saxophone/A4.[mp3|ogg]',
    'A#2': 'static/samples/saxophone/As2.[mp3|ogg]',
    'A#3': 'static/samples/saxophone/As3.[mp3|ogg]',
    'B2': 'static/samples/saxophone/B2.[mp3|ogg]',
    'B3': 'static/samples/saxophone/B3.[mp3|ogg]',
    'C3': 'static/samples/saxophone/C3.[mp3|ogg]',
    'C4': 'static/samples/saxophone/C4.[mp3|ogg]',
    'C#2': 'static/samples/saxophone/Cs2.[mp3|ogg]',
    'C#3': 'static/samples/saxophone/Cs3.[mp3|ogg]',
    'C#4': 'static/samples/saxophone/Cs4.[mp3|ogg]',
    'D2': 'static/samples/saxophone/D2.[mp3|ogg]',
    'D3': 'static/samples/saxophone/D3.[mp3|ogg]',
    'D4': 'static/samples/saxophone/D4.[mp3|ogg]',
    'D#2': 'static/samples/saxophone/Ds2.[mp3|ogg]',
    'D#3': 'static/samples/saxophone/Ds3.[mp3|ogg]'
})

var trombone = new Tone.Sampler({
    'A#2': 'static/samples/trombone/As2.[mp3|ogg]',
    'C2': 'static/samples/trombone/C2.[mp3|ogg]',
    'C3': 'static/samples/trombone/C3.[mp3|ogg]',
    'C#1': 'static/samples/trombone/Cs1.[mp3|ogg]',
    'C#3': 'static/samples/trombone/Cs3.[mp3|ogg]',
    'D2': 'static/samples/trombone/D2.[mp3|ogg]',
    'D3': 'static/samples/trombone/D3.[mp3|ogg]',
    'D#1': 'static/samples/trombone/Ds1.[mp3|ogg]',
    'D#2': 'static/samples/trombone/Ds2.[mp3|ogg]',
    'D#3': 'static/samples/trombone/Ds3.[mp3|ogg]',
    'F1': 'static/samples/trombone/F1.[mp3|ogg]',
    'F2': 'static/samples/trombone/F2.[mp3|ogg]',
    'F3': 'static/samples/trombone/F3.[mp3|ogg]',
    'G#1': 'static/samples/trombone/Gs1.[mp3|ogg]',
    'G#2': 'static/samples/trombone/Gs2.[mp3|ogg]',
    'A#0': 'static/samples/trombone/As0.[mp3|ogg]',
    'A#1': 'static/samples/trombone/As1.[mp3|ogg]'
})

var trumpet = new Tone.Sampler({
    'C5': 'static/samples/trumpet/C5.[mp3|ogg]',
    'D4': 'static/samples/trumpet/D4.[mp3|ogg]',
    'D#3': 'static/samples/trumpet/Ds3.[mp3|ogg]',
    'F2': 'static/samples/trumpet/F2.[mp3|ogg]',
    'F3': 'static/samples/trumpet/F3.[mp3|ogg]',
    'F4': 'static/samples/trumpet/F4.[mp3|ogg]',
    'G3': 'static/samples/trumpet/G3.[mp3|ogg]',
    'A2': 'static/samples/trumpet/A2.[mp3|ogg]',
    'A4': 'static/samples/trumpet/A4.[mp3|ogg]',
    'A#3': 'static/samples/trumpet/As3.[mp3|ogg]',
    'C3': 'static/samples/trumpet/C3.[mp3|ogg]'
})

var tuba = new Tone.Sampler({
    'A#1': 'static/samples/tuba/As1.[mp3|ogg]',
    'A#2': 'static/samples/tuba/As2.[mp3|ogg]',
    'D2': 'static/samples/tuba/D2.[mp3|ogg]',
    'D3': 'static/samples/tuba/D3.[mp3|ogg]',
    'D#1': 'static/samples/tuba/Ds1.[mp3|ogg]',
    'F0': 'static/samples/tuba/F0.[mp3|ogg]',
    'F1': 'static/samples/tuba/F1.[mp3|ogg]',
    'F2': 'static/samples/tuba/F2.[mp3|ogg]',
    'A#0': 'static/samples/tuba/As0.[mp3|ogg]'
})

var violin = new Tone.Sampler({
    'A3': 'static/samples/violin/A3.[mp3|ogg]',
    'A4': 'static/samples/violin/A4.[mp3|ogg]',
    'A5': 'static/samples/violin/A5.[mp3|ogg]',
    'A6': 'static/samples/violin/A6.[mp3|ogg]',
    'C4': 'static/samples/violin/C4.[mp3|ogg]',
    'C5': 'static/samples/violin/C5.[mp3|ogg]',
    'C6': 'static/samples/violin/C6.[mp3|ogg]',
    'C7': 'static/samples/violin/C7.[mp3|ogg]',
    'E4': 'static/samples/violin/E4.[mp3|ogg]',
    'E5': 'static/samples/violin/E5.[mp3|ogg]',
    'E6': 'static/samples/violin/E6.[mp3|ogg]',
    'G4': 'static/samples/violin/G4.[mp3|ogg]',
    'G5': 'static/samples/violin/G5.[mp3|ogg]',
    'G6': 'static/samples/violin/G6.[mp3|ogg]'
})

var xylophone = new Tone.Sampler({
    'C7': 'static/samples/xylophone/C7.[mp3|ogg]',
    'G3': 'static/samples/xylophone/G3.[mp3|ogg]',
    'G4': 'static/samples/xylophone/G4.[mp3|ogg]',
    'G5': 'static/samples/xylophone/G5.[mp3|ogg]',
    'G6': 'static/samples/xylophone/G6.[mp3|ogg]',
    'C4': 'static/samples/xylophone/C4.[mp3|ogg]',
    'C5': 'static/samples/xylophone/C5.[mp3|ogg]',
    'C6': 'static/samples/xylophone/C6.[mp3|ogg]'
})

var synth = new Tone.PolySynth(4, Tone.Synth);

// var metalsynth = new Tone.MetalSynth();

var membranesynth = new Tone.MembraneSynth();

var fmsynth = new Tone.PolySynth(4, Tone.FMSynth);

var duosynth = new Tone.PolySynth(4, Tone.DuoSynth);

var amsynth = new Tone.PolySynth(4, Tone.AMSynth);


var sampler = piano;
var playNotes = sampler_playNotes;
function setInstrument(ins) {
    switch(ins){
        case "cello":
            sampler = cello;
            playNotes = sampler_playNotes;
            break;
        case "bass":
            sampler = bass;
            playNotes = sampler_playNotes;
            break;
        case "bassoon":
            sampler = bassoon;
            playNotes = sampler_playNotes;
            break;
        case "clarinet":
            sampler = clarinet;
            playNotes = sampler_playNotes;
            break;
        case "contrabass":
            sampler = contrabass;
            playNotes = sampler_playNotes;
            break;
        case "flute":
            sampler = flute;
            playNotes = sampler_playNotes;
            break;
        case "french horn":
            sampler = french_horn;
            playNotes = sampler_playNotes;
            break;
        case "acoustic guitar":
            sampler = acoustic_guitar;
            playNotes = sampler_playNotes;
            break;
        case "electric guitar":
            sampler = electric_guitar;
            playNotes = sampler_playNotes;
            break;
        case "classical guitar":
            sampler = nylon_guitar;
            playNotes = sampler_playNotes;
            break;
        case "harmonium":
            sampler = harmonium;
            playNotes = sampler_playNotes;
            break;
        case "harp":
            sampler = harp;
            playNotes = sampler_playNotes;
            break;
        case "organ":
            sampler = organ;
            playNotes = sampler_playNotes;
            break;
        case "piano":
            sampler = piano;
            playNotes = sampler_playNotes;
            break;
        case "saxophone":
            sampler = saxophone;
            playNotes = sampler_playNotes;
            break;
        case "trombone":
            sampler = trombone;
            playNotes = sampler_playNotes;
            break;
        case "trumpet":
            sampler = trumpet;
            playNotes = sampler_playNotes;
            break;
        case "tuba":
            sampler = tuba;
            playNotes = sampler_playNotes;
            break;
        case "violin":
            sampler = violin;
            playNotes = sampler_playNotes;
            break;
        case "xylophone":
            sampler = xylophone;
            playNotes = sampler_playNotes;
            break;
        case "synth":
            sampler = synth;
            playNotes = synth_playNotes;
            break;
        // case "metalsynth":
        //     sampler = metalsynth;
        //     playNotes = synth_playNotes;
        //     break;
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
    sampler.connect(wah);
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
  
    socket.on('update value', function(msg) {
        var timer;

        if("effects_toggle" in msg) {
            if(msg.effects_toggle.toggle) {
                // console.log('yup')
                addEffect(msg.effects_toggle);
            }
            else {
                // console.log('nope')
                removeEffect(msg.effects_toggle.name);
            }
        }
        // sampler_playNotes(msg.notes, msg.new_swipe);
        playNotes(msg.notes, msg.new_swipe);


        if(msg.gyro != null) {
            if(pannerOn) {
                panner_update(msg.gyro);
            }
            wah_run(msg.gyro);
        } else {
            panner.setPosition(0,0,4);
        }
        
    });
  });

//set up effects chain
sampler.connect(wah);
wah.connect(tremolo);
tremolo.connect(vibe);
vibe.connect(distortion);
distortion.connect(chorus);
chorus.connect(delay);
delay.connect(reverb);
reverb.connect(panner);
panner.toMaster();
