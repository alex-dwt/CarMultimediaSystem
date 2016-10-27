/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';
import {GpsService} from '_app/service/gps.service';
import {GpsInfoPipe } from '_app/pipe/gpsInfo.pipe';

const GET_INFO_DELAY = 3;
const PROPERTIES = ['lat', 'lon', 'speed', 'time'];

@Component({
	selector: '[id=gps-info-block]',
	template: `
		<div>
			<p>Date:</p>
			<p>Time:</p>
			<p>Speed:</p>
			<p>Lat:</p>
			<p>Lon:</p>
		</div>
		<div>
			<p>{{ time | gpsInfo:"date" }}</p>
			<p>{{ time | gpsInfo:"time" }}</p>
			<p>{{ speed | gpsInfo:"speed" }}</p>
			<p>{{ lat | gpsInfo:"coordinate" }}</p>
			<p>{{ lon | gpsInfo:"coordinate" }}</p>
		</div>
	`,
	pipes: [GpsInfoPipe]
})
export class GpsComponent {
	static get parameters() {
		return [	[GpsService]];
	}

	constructor(GpsService) {
		this._gpsService = GpsService;
	}

	ngOnInit(){
		this.getInfo();
	}

	getInfo() {
		this._gpsService
			.getInfo()
			.then((data) => {
				for (let prop of PROPERTIES) {
					this[prop] = (typeof data[prop] !== 'undefined') ? data[prop] : null;
				}
				this.setTimeout();
			})
			.catch(() => {
				for (let prop of PROPERTIES) {
					this[prop] = null;
				}
				this.setTimeout();
			});
	}

	setTimeout() {
		window.setTimeout(
			() => this.getInfo(),
			GET_INFO_DELAY * 1000
		);
	}
}