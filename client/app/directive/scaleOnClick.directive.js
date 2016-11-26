/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Directive} from 'angular2/core';

@Directive({
	selector: "[scale-on-click]",
	host: {
		'[class.clicked]': 'isClicked',
		'[class.clicked-transition]': 'isTransitionable',
		'(click)': 'onClick()'
	}
})
export class ScaleOnClickDirective {
	constructor() {
		this.isClicked = false;
		this.isTransitionable = false;
	}

	onClick() {
		this.isTransitionable = this.isClicked = true;
		setTimeout(
			() => this.isTransitionable = this.isClicked = false,
			200
		);
	}
}