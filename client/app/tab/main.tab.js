/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';
import {GpsComponent} from '_app/component/gps.component';
import {ShutdownComponent} from '_app/component/shutdown.component';
import {SettingsComponent} from '_app/component/settings.component';

@Component({
	selector: '[main-tab]',
	template: `
		<section id="gps-info-block" class="two-row-status-block pull-left"></section>
		<section id="shutdown-block"></section>
		<section id="settings-block"></section>
	`,
	directives: [GpsComponent, ShutdownComponent, SettingsComponent]
})
export class MainTab {

}
