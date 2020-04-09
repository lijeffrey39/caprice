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

			// console.log("POLL DONE");
			
		}
		return;
	}


	if (logOn == false){
		logOn = true;
		triggerCounter += 1;
		counter = 0;
	} 

	if (dataType.includes("accel")){
		var xAcceleration = data['accel'][0] ;
		var yAcceleration = data['accel'][1] ;//-.45;//- .20;
		var zAcceleration = data['accel'][2] ;//-.85;//- .95;

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

	// console.log("CREATING COMBINED ACCEL CHART");

	var chartData = [logData['combined_values']];

	// console.log(chartData);

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
                  max: 300,
                  
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
	// console.log(logData);
	// console.log("CREATING ACCEL CHART");

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
                  max: 300,
                  
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
	// console.log(gyrologData);
	// console.log("CREATING GYRO CHART");

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
                  max: 300,
                  
                  fixedStepSize: 1,
                }
              }],
              yAxes: [{
                scaleLabel:{
                  display:true,
                  labelString: 'Gyro'
                },
                ticks: {
                  min: -10,
                  max: 10,
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
	// console.log(touchlogData);
	// console.log("CREATING TOUCH CHART");

	var touchchartData = [touchlogData['touch_points']];
	// console.log(touchchartData);
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

function createGyroVelChart(dataLogIndex){

	//Gyro Chart
	var gyrochart = document.getElementById('gyro_vel_chart');
	var gyrologData = dataLogGyro[dataLogIndex];
	// console.log(gyrologData);
	// console.log("CREATING GYRO CHART");

	var gyrochartData = [gyrologData['x_values'], gyrologData['y_values'], gyrologData['z_values']];
	
	var arrayLength = gyrochartData[0]['data'].length;

	var windowSize = Math.floor(arrayLength/5);

	var xWindowData = [];
	var yWindowData = [];
	var zWindowData = [];

	var xRawData = gyrochartData[0]['data'];
	var yRawData = gyrochartData[1]['data'];
	var zRawData = gyrochartData[2]['data'];
	
	for (var i = 0; i<arrayLength; i++){
		
		if(i+windowSize < arrayLength && i-windowSize >= 0){
			var xSum = 0;
			var ySum = 0;
			var zSum = 0;
			
			for (var j = i-windowSize; j<=i+windowSize; j++){
				xSum = xSum + xRawData[j]['y'];
				ySum = ySum + yRawData[j]['y'];
				zSum = zSum + zRawData[j]['y'];
			}

			xWindowData.push({x: i,
							  y: xSum});
			yWindowData.push({x: i,
							  y: ySum});
			zWindowData.push({x: i,
							  y: zSum});
		}
		
	}

	var newChartX = { label: 'x_gyro_vel',
					  data: xWindowData,
					  borderColor: gyrologData['x_values']['borderColor'],
					  pointBackgroundColor: gyrologData['x_values']['pointBackgroundColor'],
					  borderWidth: gyrologData['x_values']['borderWidth'],
					  fill: false };
	
	var newChartY = { label: 'y_gyro_vel',
					  data: yWindowData,
					  borderColor: gyrologData['y_values']['borderColor'],
					  pointBackgroundColor: gyrologData['y_values']['pointBackgroundColor'],
					  borderWidth: gyrologData['y_values']['borderWidth'],
					  fill: false };

	var newChartZ = { label: 'z_gyro_vel',
					  data: zWindowData,
					  borderColor: gyrologData['z_values']['borderColor'],
					  pointBackgroundColor: gyrologData['z_values']['pointBackgroundColor'],
					  borderWidth: gyrologData['z_values']['borderWidth'],
					  fill: false };

	var chartDataSets = [newChartX, newChartY, newChartZ];

	console.log(gyrochartData);
	console.log(chartDataSets)

	var myChartGyro = new Chart(gyrochart, {
	    type: 'line',
	    data: {
	    	datasets: chartDataSets
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
                  labelString: 'Gyro Velocity'
                },
                ticks: {
                  min: -100,
                  max: 100,
                  stepSize: 0.1,
                  fixedStepSize: 0.1,
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
	createGyroVelChart(dataLogIndex);
}
