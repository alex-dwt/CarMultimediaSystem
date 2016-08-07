/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from '_app/service/http.service'

const URL = 'http://192.168.100.15/player/';

export class PlayerService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService
	}

	play(item) {
		return this._httpService.postRequest(URL + 'play', {type: item.fileType, path: item.path});
	}

	stop() {
		return this._httpService.postRequest(URL + 'stop');
	}

	pause() {
		return this._httpService.postRequest(URL + 'pause');
	}

	resume() {
		return this._httpService.postRequest(URL + 'resume');
	}

	getStatus() {
		return this._httpService.postRequest(URL + 'status');
	}

	getDuration() {
		return this._httpService.postRequest(URL + 'get_duration');
	}

	getPosition() {
		return this._httpService.postRequest(URL + 'get_position');
	}

	setPosition(position) {
		return this._httpService.postRequest(URL + 'set_position', {position});
	}

	setAlpha(alpha) {
		return this._httpService.postRequest(URL + 'set_alpha', {alpha});
	}
}