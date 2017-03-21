#!/bin/bash
if [ $1 = 'mcircus' ] ; then
	python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 255,0,0 -x RGBWWv1
elif [ $1 = "vcircus" ] ; then
	python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 255,0,0 -x RGBWWv1
elif [ $1 = "mjungle" ] ; then
	python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 0,255,0 -x RGBWWv1
elif [ $1 = "vjungle" ] ; then
	python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 0,255,0 -x RGBWWv1
elif [ $1 = "ruimte" ] ; then
	python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 0,0,255 -x RGBWWv1
elif [ $1 = "reis" ] ; then
    python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 200,200,255 -x RGBWWv1
elif [ $1 = "white" ] ; then
    python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 255,255,255 -x RGBWWv1
elif [ $1 = "off" ] ; then
    python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 0,0,0 -x RGBWWv1
fi