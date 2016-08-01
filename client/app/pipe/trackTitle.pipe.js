/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Pipe} from 'angular2/core';

@Pipe({ name: 'trackTitle' })
export class TrackTitlePipe {
	transform(value) {
		return value ? value : 'No Title';
	}
}