/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import HttpException from '../exception/http_exception'
import {execSync} from 'child_process';
import Directory from '../model/directory';
import File from '../model/file';
import Snake from 'snakecase-keys';

const TYPES = [
	{
		name: 'audio',
		dir: '/Audio',
		ext: ['mp3', 'wav']
	},
	{
		name: 'video',
		dir: '/Video',
		ext: ['mp4', 'avi']
	}
];

export default class FilesScanner {
	/**
	 * Return all types.
	 */
	static getTypes() {
		return TYPES;
	}

	static getType(typeName) {
		return TYPES.find(o => o.name === typeName)
	}

	/**
	 * Return list of directories and files inside path.
	 */
	static scan(typeName, path) {
		checkParams(typeName, path);

		let type = this.getType(typeName);
		let fullPath = type.dir + path;
		let result = {
			dirs: [],
			files: []
		};

		// at first add parent directory if not root
		if (path !== '/') {
			let pos = path.lastIndexOf('/');
			if (pos === 0) {
				result.dirs.push(Snake(new Directory('/', 0, true)));
			} else if (pos > 0) {
				result.dirs.push(Snake(new Directory(path.substring(0, pos), 0, true)));
			}
		}

        let dirs = execSync(`
            fullPath="${fullPath}"; \
			find "$fullPath" -maxdepth 1 -not -path "$fullPath" -type d -print0 2>/dev/null \
            | xargs -I {} -0 -n1 bash -c 'temp=$(printf "%q" "{}"); echo "$temp"; echo \
            $(find "{}" -type f -regex ".+\\.\\(${type.ext.join('\\|')}\\)$" | wc -l)' 2>/dev/null
		`).toString();

		if (dirs) {
			dirs = dirs.split('\n');
			dirs.pop();
			for (let i = 0, j = dirs.length; i < j; i += 2) {
				let [p, c] = dirs.slice(i, i + 2);
                p = p.replace(type.dir, '').replace(/\\{1}([^\\])/g, '$1');
                result.dirs.push(
					Snake(new Directory(p, c))
				);
			}
		}

		let files = execSync(`
			ls -p "${fullPath}" | grep -v / | egrep -i '.+\\.(${type.ext.join('|')})$' \
			| xargs -n 1 -P 10 -I {} bash -c \
			"mediainfo --Inform=\\"General;##%Duration%##%Title%##%FileName%.%FileExtension%##\\" \\"${fullPath}/{}\\"" 2>/dev/null
        `).toString();

		if (files) {
			files = files.split('\n');
			files.pop();
			files.forEach(item => {
				let matches = item.match(/^##(.*?)##(.*?)##(.*?)##$/);
				if (matches && matches[3]) {
					result.files.push(new File(
						type.name,
						((path === '/') ? path : path + '/') + matches[3],
						matches[3],
						matches[2],
						matches[1]
					));
				}
			});
		}

		return result;
	}

	/**
	 * Remove directory or file.
	 */
	static remove(typeName, path) {
		checkParams(typeName, path);

		let type = this.getType(typeName);
		if (path === '/') {
			throw new HttpException(400, 'You can not remove "/"');
		}
		execSync("rm -rf '" + type.dir + path + "'");
	}
}

function checkParams(typeName, path) {
	if (!FilesScanner.getType(typeName)) {
		throw new HttpException(400, 'Wrong file type');
	}

	if (typeof path === 'undefined' || path === '') {
		throw new HttpException(400, 'Path is empty');
	}
}