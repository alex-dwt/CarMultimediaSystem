/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from '_app/service/http.service'

const PORT = 6080;
const URL = 'http://carpi:' + PORT;
const RECORDER_URL = URL + '/recorder';
const EXPLORER_URL = URL + '/explorer';

export class RecorderService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService;
	}

	startRecording() {
		return this._httpService.postRequest(RECORDER_URL, { }, true);
	}

    stopRecording() {
		return this._httpService.getRequest(RECORDER_URL, [], true);
	}

	getRecordingStatus() {
		return this._httpService.getRequest(RECORDER_URL);
	}

	getDirs() {
		return this._httpService.getRequest(EXPLORER_URL + '/dirs');
	}

	// saveDir() {
	// 	return this._httpService.getRequest(EXPLORER_URL, [], true);
	// }
}
