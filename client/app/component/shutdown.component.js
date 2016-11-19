/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';

import {SystemService} from '_app/service/system.service';
import {ScaleOnClickDirective} from '_app/directive/scaleOnClick.directive';

@Component({
	selector: '[id=shutdown-block]',
	template: `
		<span class="glyphicon-hdd" scale-on-click></span>
		<span class="glyphicon-log-in" scale-on-click (click)="reboot()"></span>
		<span class="glyphicon-off" scale-on-click (click)="shutdown()"></span>
	`,
	directives: [ScaleOnClickDirective]
})
export class ShutdownComponent {
	static get parameters() {
		return [[SystemService]];
	}

	constructor(systemService) {
		this._systemService = systemService;
	}

	reboot() {
		this._systemService.reboot().then((res) => {}, (res) => {});
	}

	shutdown() {
		this._systemService.shutdown().then((res) => {}, (res) => {});
	}
}