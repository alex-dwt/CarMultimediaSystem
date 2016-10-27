/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from '_app/service/http.service'

const PORT = 6070;
const URL = 'http://carpi:' + PORT + '/gps';

export class GpsService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService;
	}

	getInfo() {
		return this._httpService.getRequest(URL);
	}
}