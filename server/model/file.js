/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

export default class {
	constructor(fileType, path, fileName, title, durationMs) {
		this.fileType = fileType;
		this.path = path;
		this.fileName = fileName;
		this.title = title;
		this.duration = parseInt((parseInt(durationMs) || 0) / 1000);

		let pos = fileName.lastIndexOf('.');
		this.name = pos !== -1
			? fileName.substr(0, pos)
			: '';
	}
}