/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';

@Component({
	selector: '[id=settings-block]',
	template: `
        <input type="text" id="brightness-slider" class="slider">
	`
})
export class SettingsComponent {

    ngOnInit() {
        new rSlider({
            target: '#brightness-slider',
            values: [1, 2, 3, 4],
            set: [4],
            onChange: (val) => {
                let opacity = 1;
                switch (parseInt(val)) {
                    case 3:
                        opacity = 0.75;
                        break;
                    case 2:
                        opacity = 0.5;
                        break;
                    case 1:
                        opacity = 0.25;
                        break;
                }
                document.body.style.opacity = opacity;
            },
        });
    }
}