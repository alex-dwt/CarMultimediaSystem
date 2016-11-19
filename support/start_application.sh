#!/bin/bash
# This file is part of the CarMultimediaSystem package.
# (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
# For the full copyright and license information, please view the LICENSE file that was distributed with this source code.

DAEMON_DELAY=60
BROWSER_DELAY=60
BROWSER_WINDOWS_COUNT=6

#######
### Enable monitor by GPIO
#######
sleep 5
printf "\033c"
echo ''
echo -n '#'
gpio mode 1 out
gpio write 1 0
sleep 2
gpio mode 1 down 
gpio mode 1 in
echo -n '#'

#######
### Launch the main and supplementary applications
#######
/home/pi/CarMultimediaSystem/helper.sh start >/dev/null 2>&1
echo -n '#'
/home/pi/RemoteGpsSensorListener/helper.sh start 6070 >/dev/null 2>&1
echo -n '#'
/home/pi/RemoteCameraControl/helper.sh start 6060 >/dev/null 2>&1

#######
### Waiting the main application
#######
while true; do
    echo -n '#'
    sleep 1
    DAEMON_DELAY=$((DAEMON_DELAY-1))
    if [ "$DAEMON_DELAY" -eq 0 ]; then
        sudo shutdown -r 0 && exit 1
    fi;
    curl http://127.0.0.1 >/dev/null 2>&1
    if [ "$?" -eq 0 ]; then
        break;
    fi;
done


#######
### Launch a browser
#######
printf "\033c"
export DISPLAY=:0
X -nocursor >/dev/null 2>&1 &
xmonad >/dev/null 2>&1 &
pkill iceweasel
iceweasel -private -foreground  -fullscreen -url http://127.0.0.1 >/dev/null 2>&1 &

#######
### Waiting the browser and maximize it
#######
while true; do
    sleep 1
    BROWSER_DELAY=$((BROWSER_DELAY-1))
    if [ "$BROWSER_DELAY" -eq 0 ]; then
        exit 1
    fi;
    if [ "$(xdotool search --class firefox | wc -l)" -ge "$BROWSER_WINDOWS_COUNT" ]; then
        xdotool search --class firefox | xargs -I {} bash -c "xdotool key --window {} F11 >/dev/null 2>&1"
        break;
    fi;
done