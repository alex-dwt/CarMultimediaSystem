/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import HttpException from '../exception/http_exception'
import FilesScanner from './files_scanner'
import {execSync} from 'child_process';
import {spawn} from 'child_process';

export default class {
    static action(actionName, body) {
        switch (actionName) {
            case 'play':
			{
				if (typeof body.type === 'undefined' ||
					typeof body.path === 'undefined' ||
					!FilesScanner.getType(body.type)
				) {
					throw new HttpException(400, 'Params are wrong or missing');
				}
				stop();
				let type = FilesScanner.getType(body.type);
				let proc = spawn(
					OMX_PLAYER,
					[type.dir + body.path],
					{detached: true, stdio: ['ignore', 'ignore', 'ignore']}
				);
				proc.unref();

				return true;
			}
            case 'stop':
				stop();
				return true;
			case 'pause':
			{
				let status = getStatus();
				if (status === STATUS_STOPPED) {
					return false;
				} else if (status === STATUS_PAUSED) {
					return true;
				} else {
					return setParam('Action int32:16') === '0';
				}
			}
			case 'resume':
			{
				let status = getStatus();
				if (status === STATUS_STOPPED) {
					return false;
				} else if (status === STATUS_PLAYING) {
					return true;
				} else {
					return setParam('Action int32:16') === '0';
				}
			}
            case 'status':
				return { status: getStatus() };
            case 'get_duration':
			{
				let result = getDuration();
				return result
					? {duration: result}
					: false
			}
            case 'get_position':
			{
				let result = getParam('Position');
				if (result) {
					let pos = result.indexOf(' ');
					if (pos !== -1) {
						return {
							position: parseInt((parseInt(result.substring(pos  + 1)) || 0) / 1000000)
						};
					}
				}

				return false;
			}
            case 'set_alpha':
			{
				if (typeof body.alpha === 'undefined') {
					throw new HttpException(400, 'Param "alpha" is missing');
				}
				let alpha = parseInt(body.alpha) || 0;
				if (alpha < 0 || alpha > 255) {
					throw new HttpException(400, 'Param "alpha" is wrong');
				}

				return setParam('SetAlpha objpath:/not/used int64:' + alpha) === '0';
			}
            case 'set_position':
			{
				let position = parseInt(body.position) || 0;
				if (!position) {
					throw new HttpException(400, 'Param "position" is missing or wrong');
				}
				let duration = getDuration();
				if (!duration) {
					return false;
				}
				if (duration <= position) {
					throw new HttpException(400, 'Param "position" is greater than duration');
				}

				return setParam('SetPosition objpath:/not/used int64:' + position * 1000000) === '0';
			}
			default:
                throw new HttpException(400, 'Wrong player action');
        }
    }
}

const OMX_PLAYER = 'omxplayer';
const STATUS_PLAYING = 'playing';
const STATUS_STOPPED = 'stopped';
const STATUS_PAUSED = 'paused';

const DBUS_HEADER =
    'OMXPLAYER_DBUS_ADDR="/tmp/omxplayerdbus.${USER:-root}"; ' +
    'OMXPLAYER_DBUS_PID="/tmp/omxplayerdbus.${USER:-root}.pid"; ' +
    'export DBUS_SESSION_BUS_ADDRESS=`cat $OMXPLAYER_DBUS_ADDR  2>/dev/null`; ' +
    'export DBUS_SESSION_BUS_PID=`cat $OMXPLAYER_DBUS_PID  2>/dev/null` && ';

function getParam(name) {
	return execSync(
		DBUS_HEADER + 'dbus-send --print-reply=literal --session --reply-timeout=500 ' +
		'--dest=org.mpris.MediaPlayer2.omxplayer /org/mpris/MediaPlayer2 ' +
		'org.freedesktop.DBus.Properties.Get string:"org.mpris.MediaPlayer2.Player" string:"' + name + '" 2>/dev/null ; exit 0'
	).toString().trim();
}

function setParam(param) {
	return execSync(
		DBUS_HEADER + 'dbus-send --print-reply=literal --session ' +
		'--dest=org.mpris.MediaPlayer2.omxplayer /org/mpris/MediaPlayer2 ' +
		'org.mpris.MediaPlayer2.Player.' + param + ' >/dev/null 2>&1; echo $?; exit 0;'
	).toString().trim();
}

function stop() {
	execSync('pkill ' + OMX_PLAYER + '; exit 0');
}

function getDuration() {
	let result = getParam('Duration');
	if (result) {
		let pos = result.indexOf(' ');
		if (pos !== -1) {
			return parseInt((parseInt(result.substring(pos  + 1)) || 0) / 1000000);
		}
	}

	return false;
}

function getStatus() {
	switch (getParam('PlaybackStatus')) {
		case 'Playing':
			return STATUS_PLAYING;
		case 'Paused':
			return STATUS_PAUSED;
		default:
			return STATUS_STOPPED;
	}
}