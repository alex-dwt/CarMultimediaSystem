/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter} from 'angular2/core';

@Component({
	selector: '[id=navigation]',
	template: `
		<ul>
			<li *ngFor="let item of items" [class.active]="activeTab === item.id" (click)="onClick(item)">
				<span class="{{ item.icon }}"></span>
			</li>
		</ul>
	`,
	inputs: ['items', 'activeTab'],
	outputs: ['change']
})
export class NavbarComponent {
	constructor() {
		this.change = new EventEmitter();
	}

	onClick(item) {
		if (this.activeTab !== item.id) {
			this.activeTab = item.id;
			this.change.emit(item.id);
		}
	}
}