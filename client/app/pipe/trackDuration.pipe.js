/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Pipe} from 'angular2/core';

@Pipe({ name: 'trackDuration' })
export class TrackDurationPipe {
	transform(value) {
		let val = parseInt(value) || 0;
		if (val > 0) {
			let minutes = Math.floor(val / 60);
			minutes = minutes >= 10 ? minutes : '0' + minutes;
			let seconds = val - minutes * 60;
			seconds = seconds >= 10 ? seconds : '0' + seconds;

			return `${minutes}:${seconds}`;
		} else {
			return value;
		}
	}
}