import numpy
import math

class GestureDetector:

    def __init__(self):
        self.trigger_on = False
        self.lag = 10
        self.lag_counter = 0
        self.moving_mean = None
        self.moving_std = None
        self.prev_accel = []
        self.prev_success = []
        self.threshold = 3.75
        self.influence = 0.15
        self.peak_counter = 0


    def gesture_output(self,data):
        trigger = data['triggerButton']

        if(trigger == False):
            if self.trigger_on:
                self.trigger_on = False
                self.lag_counter = 0
                self.moving_mean = None
                self.moving_std = None
                self.prev_accel = []
                self.prev_success = []
                
                print("Number of detected peaks: ", self.peak_counter)
                # print("end")

                # f = open("gesture_outputs.txt","a")
                # f.write("Trigger Released (END) \n")
                # f.write("# of Peaks: ")
                # f.write(str(self.peak_counter))
                # f.close()

                self.peak_counter = 0

                return 'end'
            return None
        
        x_accel = data['accel'][0] + .10
        y_accel = data['accel'][1] - .40
        z_accel = data['accel'][2] - .90

        combined_accel = abs(x_accel+y_accel+z_accel)

        if(self.trigger_on == False):
            self.trigger_on = True
            self.prev_accel.append(combined_accel)
            self.prev_success.append(False)
            self.lag_counter += 1
            # f = open("gesture_outputs.txt","a")
            # f.write("\n\nTrigger Pressed (START) \n")
            # f.close()
            # print("start")
            return 'start'

        else:
            return_value = None

            self.lag_counter += 1
            if(self.moving_std != None and self.moving_mean != None):
                if(abs(combined_accel - self.moving_mean) >= self.threshold * self.moving_std):
                    
                    lag_difference = self.lag_counter-self.lag
                    window_success = self.prev_success[lag_difference:lag_difference+self.lag-1]
                    
                    if(True not in window_success and self.moving_std >= 0.02):
                        print("PEAK DETECTED \n\n\n\n\n")
                        print("Value: ", combined_accel)
                        print("Mean: ", self.moving_mean)
                        print("Std: ", self.moving_std)

                        # f = open("gesture_outputs.txt","a")
                        # f.write("Peak Detected: \n")
                        # f.write("Value: ")
                        # f.write(str(combined_accel))
                        # f.write("\n")
                        # f.write("Mean: ")
                        # f.write(str(self.moving_mean))
                        # f.write("\n")
                        # f.write("Std: ")
                        # f.write(str(self.moving_std))
                        # f.write("\n")
                        # f.close()

                        self.peak_counter += 1
                        influenced_val = self.influence * combined_accel + (1-self.influence) * self.prev_accel[-1]
                        self.prev_accel.append(influenced_val)
                        self.prev_success.append(True)

                        return_value = 'change'
                    
                    else:
                        self.prev_accel.append(combined_accel)
                        self.prev_success.append(False)

                        return_value = 'hold'

                    # return True
                else:
                    self.prev_accel.append(combined_accel)
                    self.prev_success.append(False)

                    return_value = 'hold'
                    # return False

            if(self.lag_counter >= self.lag):
                lag_difference = self.lag_counter-self.lag
                window_vals = self.prev_accel[lag_difference:lag_difference+self.lag-1]
                # print(self.prev_accel)
                # print("lag counter: ", self.lag_counter)
                # print("lag diff: ", lag_difference)
                self.moving_mean = numpy.mean(window_vals)
                self.moving_std = numpy.std(window_vals)

            else:
                self.prev_accel.append(combined_accel)
                self.prev_success.append(False)

                return_value = 'hold'
            
            return return_value

            # return 
