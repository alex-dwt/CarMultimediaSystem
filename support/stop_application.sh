#!/bin/bash
# This file is part of the CarMultimediaSystem package.
# (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
# For the full copyright and license information, please view the LICENSE file that was distributed with this source code.

#######
### Disable monitor by GPIO only on reboot
#######
sudo /bin/systemctl list-jobs | \
grep reboot.target > /dev/null && \
gpio mode 1 up