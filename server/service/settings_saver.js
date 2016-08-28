/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {readFileSync, writeFileSync} from 'fs';
import HttpException from '../exception/http_exception'

const SETTINGS_PATH = '/car-pi/server/player_settings.json';

export default class SettingsSaver {

	static getSettings(key) {
		if (typeof key === 'undefined' || key === '') {
			throw new HttpException(422, 'Param "key" is wrong or missing');
		}

		let settings = read();

		let value = (
			typeof settings[key] === 'undefined'
				? { }
				: settings[key]
		);

		return {value};
	}

	static saveSettings(body) {
		let key = String(body.key);
		if (typeof key === 'undefined' ||
			key === '' ||
			typeof body.value === 'undefined'
		) {
			throw new HttpException(422, 'Params are wrong or missing');
		}

		let settings = read();
		settings[key] = body.value;

		writeFileSync(
			SETTINGS_PATH,
			JSON.stringify(settings),
			'utf8'
		);

		return true;
	}
}

function read()
{
	try {
		let content = readFileSync(SETTINGS_PATH, 'utf8');

		return (
			content === ''
				? { }
				: JSON.parse(content)
		);
	} catch (e) {
		if (e.code === 'ENOENT') {
			return { };
		} else {
			throw e;
		}
	}
}