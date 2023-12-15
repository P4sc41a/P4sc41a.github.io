<h1> Rasplogger </h1>

This repo was created for visualizing environemental data which was logged using raspberries.
Several raspberry pi zero were logging Temperature and Humidity from a SHT30 sensor to a textfile.
The textfiles are transfered via SMB to a local NAS. Here a cron job copies them
regularly to the src folder, present in this folder.

![image](https://github.com/P4sc41a/P4sc41a.github.io/assets/153824853/bbae45c9-eee7-40c7-ae23-3f41783c94b4)

Overrall, the quality of the logged temperature and humidity appears very precise and reliable.
Initially, I placed 3 sensors in close proximity and compared them with 3 existing sensors.
The temperature accuracy was below 1°C, humidity below 3% r.H. That's excellent!.

This repo contains the html/css/js for reviewing the logged data.
The logged files can be found in the src folder.
The data is written in plain text, next time i shall use JSON immediatly.

Pascal
