#! /bin/bash
# This file is part of the CarMultimediaSystem package.
# (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
# For the full copyright and license information, please view the LICENSE file that was distributed with this source code.

WORK_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_DIR=$WORK_DIR/server

NEW_LINE=$'\n'

###################################
######### Program Entry Point #######
#################################
function main {

    case "$1" in
        "build")
            docker build -t alex_dwt/car-pi $WORK_DIR
            ;;
        "start")
            touch /home/pi/CarMultimediaSystem/server/player_settings.json

            docker start car-pi-container >/dev/null 2>&1

            if [ $? -ne 0 ]
            then
                docker rm -f car-pi-container >/dev/null 2>&1

                docker run  -d \
                    --name=car-pi-container \
                    -v /run/systemd:/run/systemd \
                    -v /home/pi/CarMultimediaSystem/server/player_settings.json:/car-pi/server/player_settings.json \
                    -v /home/pi/Audio:/Audio/hdd \
                    -v /home/pi/Video:/Video/hdd \
                    -v /opt/vc:/opt/vc:ro --device /dev/vchiq:/dev/vchiq --device /dev/fb0:/dev/fb0 \
                    -p 80:80 \
                    alex_dwt/car-pi  >/dev/null 2>&1

                if [ $? -ne 0 ]
                then
                  echo 'Failure!'
                else
                  echo 'Successfully started!'
                fi
            else
              echo 'Successfully started!'
            fi
            ;;
        "start-dev")
           docker rm -f car-pi-container >/dev/null 2>&1

            touch /home/pi/CarMultimediaSystem/server/player_settings.json

            docker run \
                --name=car-pi-container \
                -v /run/systemd:/run/systemd \
                -v /home/pi/CarMultimediaSystem/server/player_settings.json:/car-pi/server/player_settings.json \
                -v /home/pi/CarMultimediaSystem/client:/car-pi/client \
                -v /home/pi/Audio:/Audio/hdd \
                -v /home/pi/Video:/Video/hdd \
                -v /home/pi/CarMultimediaSystem/server:/car-pi/server \
                -v /opt/vc:/opt/vc:ro --device /dev/vchiq:/dev/vchiq --device /dev/fb0:/dev/fb0 \
                -p 80:80 \
                alex_dwt/car-pi
            ;;
        "run-tests")
            docker run  --rm -it \
                -v /opt/vc:/opt/vc:ro --device /dev/vchiq:/dev/vchiq --device /dev/fb0:/dev/fb0 \
                -p 80:80 \
                alex_dwt/car-pi npm test
            ;;
        "start-bash")
            docker run  --rm -it \
                -v /opt/vc:/opt/vc:ro --device /dev/vchiq:/dev/vchiq --device /dev/fb0:/dev/fb0 \
                -v /home/pi/CarMultimediaSystem/client:/car-pi/client \
                -p 80:80 \
                alex_dwt/car-pi bash
            ;;
#        "start-start")
#            docker rm -f alex_dwt_car_pi > /dev/null 2>&1
#            docker run  -it \
#                -p 80:80 \
#                --name alex_dwt_car_pi alex_dwt/car-pi npm run-script compile run-compiled
#            ;;
        *)
        echo "Wrong command. Available commands are:$NEW_LINE$NEW_LINE \
1) build$NEW_LINE \
Create a docker image which consists of everything what you need to start using this program.$NEW_LINE \
2) start-daemon$NEW_LINE \
Run server daemon in background.$NEW_LINE Usually you add this command in \
system-autorun on the server machine after running 'build' command at least one time.$NEW_LINE"
        exit 1
        ;;
    esac
}

# execute
main "$@"