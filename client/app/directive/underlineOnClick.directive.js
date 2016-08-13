/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Directive} from 'angular2/core';

@Directive({
	selector: "[underline-on-click]",
	host: {
		'[class.underline-inset]': 'isClicked',
		'(click)': 'onClick()'
	}
})
export class UnderlineOnClickDirective {
	constructor() {
		this.isClicked = false;
	}

	onClick() {
		this.isClicked = true;
		setTimeout(
			() => this.isClicked = false,
			150
		);
	}
}