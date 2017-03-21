if [ $1 = 'mcircus' ] ; then
	echo "python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 158,205,221 -x RGBWWv1"
elif [ $1 = "vcircus" ] ; then
	echo "python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 158,205,221 -x RGBWWv1"
elif [ $1 = "mjungle" ] ; then
	echo "python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 181,198,154 -x RGBWWv1"
elif [ $1 = "vjungle" ] ; then
	echo "python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 181,198,154 -x RGBWWv1"
elif [ $1 = "ruimte" ] ; then
	echo "python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 61,103,119 -x RGBWWv1"
elif [ $1 = "reis" ] ; then
    echo "python /home/pi/App/node_modules/homebridge-magichome/flux_led.py 192.168.0.20 -c 52,120,170 -x RGBWWv1"
fi
