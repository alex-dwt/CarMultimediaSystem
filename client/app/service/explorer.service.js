/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {HttpService} from '_app/service/http.service'

const FILES_URL = 'http://192.168.100.15/files/audio';

export class ExplorerService {
	static get parameters() {
		return [[HttpService]];
	}

	constructor(HttpService) {
		this._httpService = HttpService;
	}

	getDirectoryContent(path) {
		return this._httpService.getRequest(
			FILES_URL,
			[['path', path]]
		);
	}
}