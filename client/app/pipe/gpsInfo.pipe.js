/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Pipe} from 'angular2/core';

@Pipe({ name: 'gpsInfo' })
export class GpsInfoPipe {
	transform(value, type) {
		if (typeof value === 'undefined' || value === null) {
			return '-';
		}

		switch (type) {
			case 'coordinate':
				value = (typeof value === 'number')
					? Math.floor(value * 100000) / 100000
					: '-';
				break;
			case 'speed':
				value = (typeof value === 'number')
					? Math.floor(value * 10) / 10
					: '-';
				break;
			case 'date':
			{
				let date = new Date(value);
				if (!isNaN(date.getTime())) {
					value = date.getDate() + "."
						+ (date.getMonth() + 1).toString() + "."
						+ date.getFullYear().toString();
				} else {
					value = '-';
				}
				break;
			}
			case 'time':
			{
				let date = new Date(value);
				if (!isNaN(date.getTime())) {
					value = date.getHours() + ':'
						+ date.getMinutes() + ":"
						+ date.getSeconds();
				} else {
					value = '-';
				}
				break;
			}
		}

		return value;
	}
}