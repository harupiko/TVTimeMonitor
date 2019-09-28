import numpy as np
import datetime
from gpiozero import MCP3008
from time import sleep
tmp = MCP3008(channel=0, device=0, max_voltage=3.3)


with open('/tmp/current.dat', 'w', 0) as output_file:

    last_reset = datetime.datetime.now()
    total = 0
    while True:
        count = 0
        amp = []
        while count < 1000:
            Vr = (tmp.value - 0.5) * 3.3
            I = Vr / (10 * 1000) * 3000
        #    print ("Raw value: {:.4f}  Voltage: {:.4f} V Current: {:.4f} mA".format(tmp.value, Vr, I * 1000))
            amp.append(I*1000)
            sleep(0.001)
            count += 1
        baseline = np.mean(amp)
        adjusted_amp = map(lambda x: x - baseline, amp)
        rms = np.sqrt(np.mean(np.square(adjusted_amp)))

        is_on = 0
        if rms > 40.0:
            total += 1
            is_on = 1
        time_now = datetime.datetime.now()
        if time_now.time() > datetime.time(5,0) and time_now.day - last_reset.day > 0:
            total = 0
            last_reset = time_now
        #print("{},{:.4f},{},{}".format(datetime.datetime.now(), max_amp, is_on, total))
        output_file.write("{},{:.4f},{},{}\n".format(time_now, rms, is_on, total))

        sleep(59)
