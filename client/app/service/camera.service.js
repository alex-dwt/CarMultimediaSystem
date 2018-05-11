/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from 'app/service/http.service'

const PORT = 6060;
const URL = 'http://carpi:' + PORT + '/camera';

export class CameraService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService;
	}

	enableCamera() {
		return this._httpService.postRequest(URL, { }, true);
	}

	disableCamera() {
		return this._httpService.getRequest(URL, [], true);
	}

	getCameraUrl() {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 2) {
					if (xhr.status === 200) {
						resolve(URL + '?_rand=' + Math.random());
					} else {
						reject();
					}
					xhr.abort();
				}
			};
			xhr.open('GET', URL);
			xhr.send();
		});
	}
}