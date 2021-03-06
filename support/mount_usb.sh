#!/bin/bash
# This file is part of the CarMultimediaSystem package.
# (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
# For the full copyright and license information, please view the LICENSE file that was distributed with this source code.

set -e

DEV=/dev/$1

#######
###  Do not mount My Transcend USB
#######
if [ $(blkid "$DEV" | grep -c 8f6d9cb8-84ac-449c-ba2a-939bd59d72eb) -eq 1 ]; then
    exit
fi


#######
### Mount USB on host
#######
mount -t auto -o noexec,nodev,noatime,nodiratime $DEV /home/pi/Usb


#######
### Mount USB on docker container (container doesn't have "--privileged" flag)
#######
DEVDEC=$(printf "%d %d" $(stat --format "0x%t 0x%T" $DEV))
PID=$(docker inspect --format "{{ .State.Pid }}" car-pi-container)

[ $PID -gt 0 ] && sudo nsenter --target $PID -m bash -c "rm -f $DEV; \
    mknod --mode 0600 $DEV b $DEVDEC; \
    mount -t auto -o noexec,nodev,noatime,nodiratime $DEV /Usb"