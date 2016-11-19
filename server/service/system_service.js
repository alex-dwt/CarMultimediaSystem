/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {exec} from 'child_process';

export default class SystemService {
	static doCommand(commandName) {
		switch (commandName) {
			case 'shutdown':
				exec('sleep 1 && shutdown -h 0');
				break;
			case 'reboot':
				exec('sleep 1 && shutdown -r 0');
				break;
		}
	}
}