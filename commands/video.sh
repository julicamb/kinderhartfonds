#!/bin/bash
killall omxplayer.bin
sleep 0.1
killall omxplayer.bin
killall omxplayer.bin
if [ "$3" == "" ] ; then
    omxplayer --win "0 0 1920 930" --loop --no-osd /home/pi/App/usbdrv/assets/videos/$1/$2.mp4
else
	omxplayer --win "0 0 1920 930" --no-osd /home/pi/App/usbdrv/assets/videos/$1/$2-$3.mp4
    omxplayer --win "0 0 1920 930" --loop --no-osd /home/pi/App/usbdrv/assets/videos/$1/$3.mp4
fi
