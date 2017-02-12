/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from '_app/service/http.service'

const FILES_URL = 'http://carpi/files/';
//const FILES_URL = 'http://192.168.100.15/files/';

export class ExplorerService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService;
	}

	getDirectoryContent(fileType, path) {
		return this._httpService.getRequest(
			FILES_URL + fileType,
			[['path', path]]
		);
	}

	deleteFile(fileType, path) {
		return this._httpService.getRequest(
			FILES_URL + fileType,
			[['path', path]],
			true
		);
	}
}