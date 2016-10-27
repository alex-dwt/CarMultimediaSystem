/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';
import {GpsComponent} from '_app/component/gps.component';

@Component({
	selector: '[main-tab]',
	template: `
		<section id="gps-info-block"></section>
	`,
	directives: [GpsComponent]
})
export class MainTab {

}