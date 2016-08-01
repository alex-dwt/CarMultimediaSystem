/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter, OnInit} from 'angular2/core';
import {TrackDurationPipe } from '_app/pipe/trackDuration.pipe';
import {TrackTitlePipe } from '_app/pipe/trackTitle.pipe';

import {PagingComponent} from '_app/component/paging.component';

@Component({
	selector: '[playlist]',
	template: `
		<div class="panel-label">
			<p>Playlist</p>
		</div>

		<ul>
			<li *ngFor="let item of currentItems" class="explorer-row" [class.delete-process]="item.isWantToDelete" [class.active]="item.isActive">
				<div class="info-block">
					<span class="glyphicon" aria-hidden="true">&nbsp;</span>
					<span class="dir-badge length-badge">{{ item.duration | trackDuration }}</span>
				</div>
				<div class="name-block file-name-block">
					<p>{{ item.name }}</p>
					<p>{{ item.title | trackTitle }}</p>
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

			<div paging
				(change)="onCurrentItemsChange($event)"
				[items]="items"
				[itemsPerPage]="itemsPerPage">
			</div>

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
	`,
	directives: [PagingComponent],
	inputs: ['addFileEvent', 'addDirectoryEvent'],
	pipes: [TrackDurationPipe, TrackTitlePipe]
})
export class PlaylistComponent {
	constructor() {
		this.items = [];
		this.currentItems = [];
		this.itemsPerPage = 4;
	}

	ngOnInit(){
		this.addFileEvent.subscribe(item => {
			this.items = this.items.filter((e) => e.path !== item.path);
			this.items.push(item);
		});

		this.addDirectoryEvent.subscribe(item => {
			console.log('addDirectoryEvent PLAYLIST')
			console.log(item)
		});
	}

	onCurrentItemsChange(currentItems) {
		this.currentItems = currentItems.map((item) => {
			item.isWantToDelete = false;
			item.isActive = false; // todo
			return item;
		});
	}
}