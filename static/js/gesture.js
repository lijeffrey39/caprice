var prevAccelerationData = {};
var detectOn = false;
var k = 3;

function detectGesture(data, trigger){

	if(trigger == false){
		if(detectOn){
			detectOn = false;
			console.log("DETECTION COMPLETE");
		}

		return;
	}

	if(detectOn == false){
		detectOn = true;
		
	}
	
	var outcome = evaluateAcceleration(data['accel']);

	console.log(outcome);


}

function evaluateAcceleration(accelData){
	var xAcceleration = accelData[0] + .10;
	var yAcceleration = accelData[1] - .40;
	var zAcceleration = accelData[2] - .90;

	var combined = Math.abs(xAcceleration + yAcceleration + zAcceleration);

	//if the first event
	if(prevAccelerationData == {}){
		
		if(combined > 0.8){


		}

	}

	//not the first event
}