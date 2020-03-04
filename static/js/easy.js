console.log("i'm a chart");

var dataLog = {};
var dataLogGyro = {};
var dataLogTouch = {};
var dataLogCombine = {};

var logOn = false;
var triggerCounter = 0;
var counter = 0;

function startLog(dataType, data, trigger){
	if (trigger == false){
		if (logOn){
			logOn = false;
			createCharts(triggerCounter);

			console.log("POLL DONE");
			
		}
		return;
	}


	if (logOn == false){
		logOn = true;
		triggerCounter += 1;
		counter = 0;
	} 

	if (dataType.includes("accel")){
		var xAcceleration = data['accel'][0] + .10;
		var yAcceleration = data['accel'][1] - .40;
		var zAcceleration = data['accel'][2] - .90;

		if(dataLog[triggerCounter] == null){
			dataLog[triggerCounter] = {};
			dataLog[triggerCounter]['x_values'] = {
				label: 'x_accel',
				data: [],
				borderColor: '#f59203',
				pointBackgroundColor: '#f59203',
				borderWidth: 1,
				fill: false
			};
			dataLog[triggerCounter]['y_values'] = {
				label: 'y_accel',
				data: [],
				borderColor: '#5BA0CE',
				pointBackgroundColor: '#5BA0CE',
				borderWidth: 1,
				fill: false
			};
			dataLog[triggerCounter]['z_values'] = {
				label: 'z_accel',
				data: [],
				borderColor: '#76dc45',
				pointBackgroundColor: '#76dc45',
				borderWidth: 1,
				fill: false
			};
		}

		if(dataLogCombine[triggerCounter] == null){
			dataLogCombine[triggerCounter] = {};
			dataLogCombine[triggerCounter]['combined_values'] = {
				label: 'combined accelerations',
				data: [],
				borderColor: '#f59203',
				pointBackgroundColor: '#f59203',
				borderWidth: 1,
				fill: false
			};
		}

		var cAccelerationPoint = {
			x: counter,
			y: Math.abs(xAcceleration + yAcceleration + zAcceleration)
		}

		var xAccelerationPoint = {
			x : counter,
			y : xAcceleration
		};

		var yAccelerationPoint = {
			x: counter,
			y: yAcceleration
		};

		var zAccelerationPoint = {
			x: counter,
			y: zAcceleration
		};

		dataLog[triggerCounter]['x_values']['data'].push(xAccelerationPoint);
		dataLog[triggerCounter]['y_values']['data'].push(yAccelerationPoint);
		dataLog[triggerCounter]['z_values']['data'].push(zAccelerationPoint);

		dataLogCombine[triggerCounter]['combined_values']['data'].push(cAccelerationPoint);

		// counter += 1;
	
	}

	if(dataType.includes("gyro")){
		var xGyro = data['gyro'][0];
		var yGyro = data['gyro'][1];
		var zGyro = data['gyro'][2];

		if(dataLogGyro[triggerCounter] == null){
			dataLogGyro[triggerCounter] = {};
			dataLogGyro[triggerCounter]['x_values'] = {
				label: 'x_gyro',
				data: [],
				borderColor: '#f59203',
				pointBackgroundColor: '#f59203',
				borderWidth: 1,
				fill: false
			};
			dataLogGyro[triggerCounter]['y_values'] = {
				label: 'y_gyro',
				data: [],
				borderColor: '#5BA0CE',
				pointBackgroundColor: '#5BA0CE',
				borderWidth: 1,
				fill: false
			};
			dataLogGyro[triggerCounter]['z_values'] = {
				label: 'z_gyro',
				data: [],
				borderColor: '#76dc45',
				pointBackgroundColor: '#76dc45',
				borderWidth: 1,
				fill: false
			};
		}

		var xGyroPoint = {
			x : counter,
			y : xGyro
		};

		var yGyroPoint = {
			x: counter,
			y: yGyro
		};

		var zGyroPoint = {
			x: counter,
			y: zGyro
		};

		dataLogGyro[triggerCounter]['x_values']['data'].push(xGyroPoint);
		dataLogGyro[triggerCounter]['y_values']['data'].push(yGyroPoint);
		dataLogGyro[triggerCounter]['z_values']['data'].push(zGyroPoint);

	}

	if(dataType.includes("touch")){
		var xTouch = data['axisX'];
		var yTouch = data['axisY'];

		if(dataLogTouch[triggerCounter] == null){
			dataLogTouch[triggerCounter] = {};
			dataLogTouch[triggerCounter]['touch_points'] = {
				label: 'touchpad',
				data: [],
				borderColor: '#f59203',
				pointBackgroundColor: '#f59203',
				borderWidth: 1,
				fill: false
			};

		}

		var touchPoint = {
			x : xTouch,
			y : yTouch
		};

		dataLogTouch[triggerCounter]['touch_points']['data'].push(touchPoint);

	}

	counter += 1;


}

function createCombinedAccelChart(dataLogIndex){

	var ctx = document.getElementById('combine_accel_chart');
	var logData = dataLogCombine[dataLogIndex];

	console.log("CREATING COMBINED ACCEL CHART");

	var chartData = [logData['combined_values']];

	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	    	datasets: chartData
	    },
	    options: {

            responsive:  true,
            scales: {
              xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel:{
                  display: true,
                  labelString: 'Ticks'
                },
                ticks: {
                  min: 0,
                  max: 100,
                  
                  fixedStepSize: 1,
                }
              }],
              yAxes: [{
                scaleLabel:{
                  display:true,
                  labelString: 'Acceleration'
                },
                ticks: {
                  min: -3,
                  max: 3,
                  stepSize: 0.1,
                  fixedStepSize: 0.1,
                }
              }]
            }
        }
	});

}

function createAccelChart(dataLogIndex){

	//Acceleration Chart

	var ctx = document.getElementById('accel_chart');
	var logData = dataLog[dataLogIndex];
	console.log(logData);
	console.log("CREATING ACCEL CHART");

	var chartData = [logData['x_values'], logData['y_values'], logData['z_values']];
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	    	datasets: chartData
	    },
	    options: {

            responsive:  true,
            scales: {
              xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel:{
                  display: true,
                  labelString: 'Ticks'
                },
                ticks: {
                  min: 0,
                  max: 100,
                  
                  fixedStepSize: 1,
                }
              }],
              yAxes: [{
                scaleLabel:{
                  display:true,
                  labelString: 'Acceleration'
                },
                ticks: {
                  min: -2,
                  max: 2,
                  stepSize: 0.1,
                  fixedStepSize: 0.1,
                }
              }]
            }
        }
	});

}

function createGyroChart(dataLogIndex){

	//Gyro Chart
	var gyrochart = document.getElementById('gyro_chart');
	var gyrologData = dataLogGyro[dataLogIndex];
	console.log(gyrologData);
	console.log("CREATING GYRO CHART");

	var gyrochartData = [gyrologData['x_values'], gyrologData['y_values'], gyrologData['z_values']];
	var myChartGyro = new Chart(gyrochart, {
	    type: 'line',
	    data: {
	    	datasets: gyrochartData
	    },
	    options: {

            responsive:  true,
            scales: {
              xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel:{
                  display: true,
                  labelString: 'Ticks'
                },
                ticks: {
                  min: 0,
                  max: 100,
                  
                  fixedStepSize: 1,
                }
              }],
              yAxes: [{
                scaleLabel:{
                  display:true,
                  labelString: 'Gyro'
                },
                ticks: {
                  min: -2,
                  max: 2,
                  stepSize: 0.1,
                  fixedStepSize: 0.1,
                }
              }]
            }
        }
	});
}

function createTouchChart(dataLogIndex){
	//Touch Chart
	var touchchart = document.getElementById('touch_chart');
	var touchlogData = dataLogTouch[dataLogIndex];
	console.log(touchlogData);
	console.log("CREATING TOUCH CHART");

	var touchchartData = [touchlogData['touch_points']];
	console.log(touchchartData);
	var myChartTouch = new Chart(touchchart, {
	    type: 'scatter',
	    data: {
	    	datasets: touchchartData
	    },
	    options: {
            responsive:  true,
            scales: {
              xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel:{
                  display: true,
                  labelString: 'X Pos'
                },
                ticks: {
                  min: 0,
                  max: 400,
                  stepSize: 10,
                  // fixedStepSize: 10,
                }
              }],
              yAxes: [{
                scaleLabel:{
                  display:true,
                  labelString: 'Y Pos'
                },
                ticks: {
                  min: 0,
                  max: 400,
                  stepSize: 10,
                  // fixedStepSize: 10,
                }
              }]
            }
        }
	});
}

function createCharts(dataLogIndex){
	createAccelChart(dataLogIndex);
	createGyroChart(dataLogIndex);
	createTouchChart(dataLogIndex);
	createCombinedAccelChart(dataLogIndex);
}
