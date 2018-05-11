/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from 'app/service/http.service'

const URL = 'http://carpi/settings/';
//const URL = 'http://192.168.100.15/settings/';

export class SettingsService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService
	}

	save(key, value) {
		return this._httpService.postRequest(URL, {key, value});
	}

	read(key) {
		return this._httpService.getRequest(URL, [['key', key]]);
	}
}