/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';

@Component({
	selector: '[camera-tab]',
	template: `
		<div>
			<img src="http://carpi:6100/?action=stream"/>
		</div>
	`
})
export class CameraTab {
}