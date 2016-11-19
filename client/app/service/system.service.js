/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from '_app/service/http.service'

const URL = 'http://carpi/system/';

export class SystemService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService;
	}

	shutdown() {
		return this._httpService.postRequest(URL + 'shutdown');
	}

	reboot() {
		return this._httpService.postRequest(URL + 'reboot');
	}
}