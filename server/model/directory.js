/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

export default class {
	constructor(path, filesCount, isParentDir = false) {
		this.path = path;
		this.filesCount = parseInt(filesCount) || 0;
		this.isParentDir = isParentDir;
		this.dirName = '';

		if (!isParentDir) {
			let pos = this.path.lastIndexOf('/');
			if (pos !== -1) {
				this.dirName = this.path.substr(++pos);
			}
		}
	}
}