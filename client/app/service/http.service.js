/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import { Http, HTTP_PROVIDERS, Headers, RequestOptions, URLSearchParams } from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export class HttpService {
	static get parameters() {
		return [[Http]];
	}

	constructor(http) {
		this._http = http
	}

	getRequest(url, urlParams = []){
		let params = new URLSearchParams();
		urlParams
			.concat([['_rand', Math.random()]])
			.forEach(param => params.set(param[0], param[1]));

		return this._http.get(
			url,
			new RequestOptions({
				headers: new Headers({ 'Content-Type': 'application/json' }),
				search: params
			})
		)
			.map(this._extractData)
			.toPromise();
	}

	postRequest(url, data = { }){
		return this._http.post(
			url,
			JSON.stringify(data),
			new RequestOptions({
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		)
			.map(this._extractData)
			.toPromise();
	}

	_extractData(res) {
		let body = res.json();
		return body || false;
	}
}