/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';
import {CameraService} from 'app/service/camera.service';

const CHECK_CAMERA_DELAY = 1;

@Component({
	selector: '[camera-tab]',
	template: `
		<div>
			<img src="{{ url }}">
		</div>
	`
})
export class CameraTab {
	static get parameters() {
		return [	[CameraService]];
	}

	constructor(cameraService) {
		this._cameraService = cameraService;
		this.url = null;
		checkCameraAvailability.call(this);
	}

	ngOnInit(){
		this.url = '';
		this._cameraService.enableCamera();
	}

	ngOnDestroy(){
		this.url = null;
		this._cameraService.disableCamera();
	}
}

function checkCameraAvailability() {
	if (this.url === '') {
		this._cameraService
			.getCameraUrl()
			.then((url) => {
				this.url = url;
				setTimeout.call(this);
			})
			.catch(() => setTimeout.call(this));

		return;
	}

	setTimeout.call(this);
}

function setTimeout() {
	window.setTimeout(
		() => checkCameraAvailability.call(this),
		CHECK_CAMERA_DELAY * 1000
	);
}