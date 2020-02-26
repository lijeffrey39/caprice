console.log("i'm a cunt");
console.log("sfdjlksd");
// import { Synth } from "tone";
// console.log("sdlkfj");
import * as Tone from "tone";

//create a synth and connect it to the master output (your speakers)
const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("C4", "8n");

// console.log("wat");
