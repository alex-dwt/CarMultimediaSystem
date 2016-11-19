# This file is part of the CarMultimediaSystem package.
# (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
# For the full copyright and license information, please view the LICENSE file that was distributed with this source code.

FROM sdhibit/rpi-raspbian
MAINTAINER Alexander Lukashevich <aleksandr.dwt@gmail.com>

RUN apt-get update && \
    apt-get install -y  --no-install-recommends wget ca-certificates mediainfo dbus libfreetype6 libssl-dev libssh-dev libsmbclient-dev

COPY ./build/* /tmp/
RUN dpkg -i /tmp/omxplayer.deb && rm -f /tmp/omxplayer.deb

RUN cd /tmp && mkdir _node && \
    wget -O node.tar.xz https://nodejs.org/dist/v6.2.2/node-v6.2.2-linux-armv7l.tar.xz && \
    tar xvf node.tar.xz  -C _node && cp -r _node/$(ls _node/)/* /usr/local/ && \
    rm -f node.tar.xz && rm -rf _node

# server
RUN mkdir -p /car-pi/server
COPY ./server/package.json /car-pi/server/
WORKDIR /car-pi/server
RUN npm install
COPY ./server /car-pi/server/
RUN mkdir build && \
    npm run build && \
    ln -s /car-pi/server/node_modules /car-pi/server/build/node_modules



# client
# RUN mkdir -p /car-pi/client
# COPY ./client /car-pi/client/
# RUN cd /car-pi/client/ && npm install


#RUN mkdir _compiled 2>/dev/null ; \
#    ln -s /car-pi/server/node_modules /car-pi/server/_compiled/node_modules 2>/dev/null ; \
#    exit 0
#    "start": "npm run compile && npm run run-compiled",
#    "dev": "babel-node app.js",
#    "compile": "babel . -d _compiled --ignore=\"node_modules\"",
#    "run-compiled": "node _compiled/app.js"


CMD ["npm","start"]