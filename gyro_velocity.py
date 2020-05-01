class GyroVelocity:

    def __init__(self):
        self.trigger_on = False
        self.lag = 20
        self.lag_counter = 0
        self.prev_gyro_x = []
        self.prev_gyro_y = []
        self.prev_gyro_z = []
        self.current_velocity = {'x': 0,
                                 'y': 0,
                                 'z': 0 }

    def velocity_output(self,data):

        trigger = data['triggerButton']

        if(trigger == False):
            if(self.trigger_on):
                self.trigger_on = False
                self.lag_counter = 0
                self.prev_gyro_x = []
                self.prev_gyro_y = []
                self.prev_gyro_z = []

                self.current_velocity['trigger'] = 'end'
                
                return self.current_velocity
            
            self.current_velocity = {'x': 0,
                                     'y': 0,
                                     'z': 0}
                                        
            return None
        
        x_gyro = data['gyro'][0]
        y_gyro = data['gyro'][1]
        z_gyro = data['gyro'][2]

        if(self.trigger_on == False):
            self.trigger_on = True
            self.prev_gyro_x.append(x_gyro)
            self.prev_gyro_y.append(y_gyro)
            self.prev_gyro_z.append(z_gyro)
            self.lag_counter += 1

            self.current_velocity['trigger'] = 'start'

        else:

            self.lag_counter += 1
            self.current_velocity['trigger'] = 'hold'
            
            if(self.lag_counter >= self.lag):
                lag_difference = self.lag_counter - self.lag

                self.prev_gyro_x.append(x_gyro)
                self.prev_gyro_y.append(y_gyro)
                self.prev_gyro_z.append(z_gyro)
                
                x_window_vals = self.prev_gyro_x[lag_difference:lag_difference+self.lag-1]
                y_window_vals = self.prev_gyro_y[lag_difference:lag_difference+self.lag-1]
                z_window_vals = self.prev_gyro_z[lag_difference:lag_difference+self.lag-1]

                x_vel = sum(x_window_vals)
                y_vel = sum(y_window_vals)
                z_vel = sum(z_window_vals)

                self.current_velocity['x'] = x_vel
                self.current_velocity['y'] = y_vel
                self.current_velocity['z'] = z_vel

            else:
                self.prev_gyro_x.append(x_gyro)
                self.prev_gyro_y.append(y_gyro)
                self.prev_gyro_z.append(z_gyro)
        
        return self.current_velocity