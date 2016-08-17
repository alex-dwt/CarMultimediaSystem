/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {readFileSync, writeFileSync} from 'fs';
import HttpException from '../exception/http_exception'

const SETTINGS_PATH = '/car-pi/server/player_settings.json';

export default class SettingsSaver {

	static getSettings() {
		try {
			let content = readFileSync(SETTINGS_PATH, 'utf8');
			if (content === '') {
				return {settings: { }};
			} else {
				return {
					settings: JSON.parse(content)
				};
			}
		} catch (e) {
			if (e.code === 'ENOENT') {
				return {settings: { }};
			} else {
				throw e;
			}
		}
	}

	static saveSettings(body) {
		if (typeof body.settings === 'undefined') {
			throw new HttpException(422, 'Params are wrong or missing');
		}

		writeFileSync(
			SETTINGS_PATH,
			JSON.stringify(body.settings),
			'utf8'
		);

		return true;
	}
}