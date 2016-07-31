/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component} from 'angular2/core';

@Component({
	selector: '[playlist]',
	template: `
		<div class="panel-label">
			<p>Playlist</p>
		</div>
		<ul>
			<li class="explorer-row">
				<div class="info-block">
					<span class="glyphicon" aria-hidden="true">&nbsp;</span>
					<span class="dir-badge length-badge">33:11</span>
				</div>
				<div class="name-block file-name-block">
					<p>/Video/Music/NFS/lala.mp3</p>
					<p>Get Low Taram Taram</p>
				</div>
				<div class="actions-block">
					<div><span class="glyphicon-play-circle play-file-icon" aria-hidden="true"></span></div>
					<div><span class="glyphicon-share-alt" aria-hidden="true"></span></div>
					<div><span class="glyphicon-remove-circle" aria-hidden="true"></span></div>
					<div class="delete-block">
						<p>Are you sure?</p>
						<div><span class="glyphicon-ok" aria-hidden="true"></span></div>
						<div><span class="glyphicon-remove" aria-hidden="true"></span></div>
					</div>
				</div>
			</li>
			<li class="explorer-row active" id="fake-deletion2">
				<div class="info-block">
					<span class="glyphicon" aria-hidden="true">&nbsp;</span>
					<span class="dir-badge length-badge">33:11</span>
				</div>
				<div class="name-block file-name-block">
					<p>/Video/Music/NFS/lala.mp3</p>
					<p>Get Low Taram Taram</p>
				</div>
				<div class="actions-block">
					<div><span class="glyphicon-play-circle play-file-icon" aria-hidden="true"></span></div>
					<div><span class="glyphicon-share-alt" aria-hidden="true"></span></div>
					<div><span class="glyphicon-remove-circle" aria-hidden="true" onclick="document.getElementById('fake-deletion2').className='explorer-row delete-process';"></span></div>
					<div class="delete-block">
						<p>Are you sure?</p>
						<div><span class="glyphicon-ok" aria-hidden="true"></span></div>
						<div><span class="glyphicon-remove" aria-hidden="true"></span></div>
					</div>
				</div>
			</li>
			<li class="explorer-row">
				<div class="info-block">
					<span class="glyphicon" aria-hidden="true">&nbsp;</span>
					<span class="dir-badge length-badge">33:11</span>
				</div>
				<div class="name-block file-name-block">
					<p>/Video/Music/NFS/lala.mp3</p>
					<p>Get Low Taram Taram</p>
				</div>
				<div class="actions-block">
					<div><span class="glyphicon-play-circle play-file-icon" aria-hidden="true"></span></div>
					<div><span class="glyphicon-share-alt" aria-hidden="true"></span></div>
					<div><span class="glyphicon-remove-circle" aria-hidden="true"></span></div>
					<div class="delete-block">
						<p>Are you sure?</p>
						<div><span class="glyphicon-ok" aria-hidden="true"></span></div>
						<div><span class="glyphicon-remove" aria-hidden="true"></span></div>
					</div>
				</div>
			</li>
		</ul>
		<section class="panel-paging">
			<span class="glyphicon-arrow-left" aria-hidden="true"></span>
			<p>15-30 of 80</p>
			<span class="glyphicon-arrow-right" aria-hidden="true"></span>
			<div class="select-playlist">
				<span id="show-current-track" class="glyphicon-new-window" aria-hidden="true"></span>
				<span class="glyphicon-file" aria-hidden="true" onclick="document.getElementById('playlist-menu').className='active';"></span>
			</div>
			<section id="playlist-menu">
				<ul>
					<li>1</li>
					<li class="active">2</li>
					<li>3</li>
					<li>4</li>
					<li>5</li>
				</ul>
				<ul>
					<li>6</li>
					<li>7</li>
					<li>8</li>
					<li>9</li>
					<li>10</li>
				</ul>
			</section>
		</section>
	`
})
export class PlaylistComponent {

}