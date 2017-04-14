/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from '_app/service/http.service'

const PORT = 6080;
const URL = 'http://carpi:' + PORT;
const RECORDER_URL = URL + '/recorder';
const CONVERTER_URL = URL + '/converter';
const EXPLORER_URL = URL + '/explorer';
const STATUS_URL = URL + '/status';

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

	startConverting() {
		return this._httpService.postRequest(CONVERTER_URL, { }, true);
	}

    stopConverting() {
		return this._httpService.getRequest(CONVERTER_URL, [], true);
	}

	getStatus() {
		return this._httpService.getRequest(STATUS_URL);
	}

	getDirs() {
		return this._httpService.getRequest(EXPLORER_URL);
	}

	saveDir(dirName) {
        return this._httpService.postRequest(EXPLORER_URL + '/' + dirName, { }, true);
	}

    deleteDir(dirName) {
        return this._httpService.getRequest(EXPLORER_URL + '/' + dirName, [], true);
    }
}
