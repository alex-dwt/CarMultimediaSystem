/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter, OnInit} from 'angular2/core';
import {TrackDurationPipe } from '_app/pipe/trackDuration.pipe';
import {TrackTitlePipe } from '_app/pipe/trackTitle.pipe';
import {SettingsService} from '_app/service/settings.service';

import {PagingComponent} from '_app/component/paging.component';
import {ScaleOnClickDirective} from '_app/directive/scaleOnClick.directive';

@Component({
	selector: '[playlist]',
	template: `
		<div class="panel-label">
			<p>Playlist</p>
		</div>

		<ul class="items-box">
			<li *ngFor="let item of currentItems"
				class="explorer-row"
				[class.delete-process]="item.isWantToDelete"
				[class.active]="item.path === currentPlayingItemPath"
				[class.delete-process]="item.isWantToDelete"
			>
				<div class="info-block">
					<span class="glyphicon">&nbsp;</span>
					<p class="dir-badge length-badge">{{ item.duration | trackDuration }}</p>
				</div>
				<div class="name-block file-name-block">
					<p>{{ item.name }}</p>
					<p>{{ item.title | trackTitle }}</p>
				</div>
				<div class="actions-block">
					<div><span scale-on-click class="glyphicon-play-circle" (click)="playItem(item)"></span></div>
					<div><span class="glyphicon-share-alt" style="color: grey;"></span></div>
					<div><span class="glyphicon-remove-circle" (click)="item.isWantToDelete=true"></span></div>
					<div class="delete-block">
						<p>Are you sure?</p>
						<div><span class="glyphicon-ok" (click)="deleteItem(item)"></span></div>
						<div><span class="glyphicon-remove" (click)="item.isWantToDelete=false"></span></div>
					</div>
				</div>
			</li>
		</ul>

		<section class="panel-paging">

			<div paging
				(change)="onCurrentItemsChange($event)"
				[showItemEvent]="showItemEvent"
				[items]="items"
				[itemsPerPage]="itemsPerPage">
			</div>

			<div class="select-playlist">
				<span scale-on-click class="glyphicon-new-window show-current-track-icon" (click)="goToActiveItem()"></span>
				<span class="glyphicon-file" (click)="isShowPlaylistSelector=true"></span>
				<p (click)="isShowPlaylistSelector=true">{{ currentPlaylistId }}</p>
			</div>

			<section class="playlist-menu" [class.active]="isShowPlaylistSelector">
				<template ngFor let-row [ngForOf]="playlistSelectorItems">
				<ul>
					<li *ngFor="let item of row" [class.active]="item.isActive" (click)="selectPlaylist(item.id)">
						{{ item.label }}
					</li>
				</ul>
				</template>
			</section>

		</section>
	`,
	directives: [PagingComponent, ScaleOnClickDirective],
	inputs: ['addFileEvent', 'addDirectoryEvent', 'playFileEvent', 'playNextTrackEvent', 'playPrevTrackEvent'],
	pipes: [TrackDurationPipe, TrackTitlePipe]
})
export class PlaylistComponent {
	static get parameters() {
		return [[SettingsService]];
	}

	constructor(settingsService) {
		this._settingsService = settingsService;

		this.playlistItems = [];

		this.currentItems = [];
		this.itemsPerPage = 4;
		this.currentPlayingItemPath = '';
		this.showItemEvent = new EventEmitter();

		this.currentPlaylistId = 1;
		this.isShowPlaylistSelector = false;
		this.playlistSelectorItems = [];
		{
			let label = 1;
			let id = 1;
			for (let i = 0; i < 2; i++) {
				let row = [];
				for (let j = 0; j < 5; j++) {
					row.push({
						id,
						label,
						isActive: this.currentPlaylistId === id
					});
					this.playlistItems[id] = [];
					label++;
					id++;
				}
				this.playlistSelectorItems.push(row);
			}
		}

		this.items = this.playlistItems[this.currentPlaylistId];
	}

	ngOnInit(){
		this.addFileEvent.subscribe(item => {
			let i = this.items.findIndex(e => e.path === item.path);
			if (i !== -1) {
				this.items.splice(i,1);
			}
			this.items.push(Object.assign({}, item));

			// redraw playlist
			this.showItemEvent.emit(false);

			this._settingsService.save('playlistItems', this.playlistItems);
		});

		this.addDirectoryEvent.subscribe(item => {
			console.log('addDirectoryEvent PLAYLIST')
			console.log(item)
		});

		this.playFileEvent.subscribe(item => this.currentPlayingItemPath = item.path);

		this.playNextTrackEvent.subscribe((settings) => {
			let pos = this._getPlayingItemPos();

			if (pos !== false) {
				let item = this.playlistItems[pos.playlistId][pos.pos + 1];
				if (item) {
					this.playFileEvent.emit(item);
				} else if (settings.isStartFromFirstAllowed && this.playlistItems[pos.playlistId].length) {
					this.playFileEvent.emit(this.playlistItems[pos.playlistId][0]);
				}
			}
		});

		this.playPrevTrackEvent.subscribe(() => {
			let pos = this._getPlayingItemPos();

			if (pos !== false) {
				let item = this.playlistItems[pos.playlistId][pos.pos - 1];
				if (item) {
					this.playFileEvent.emit(item);
				}
			}
		});
	}

	onCurrentItemsChange(currentItems) {
		this.currentItems = currentItems.map((item) => {
			item.isWantToDelete = false;
			return item;
		});
	}

	selectPlaylist(playlistId, itemId) {
		this.isShowPlaylistSelector = false;

		if (this.currentPlaylistId === playlistId) {
			if (typeof itemId !== 'undefined') {
				this.showItemEvent.emit(itemId);
			}

			return;
		}

		this.playlistSelectorItems.forEach((rowItem, rowIndex, row) => {
			rowItem.forEach((item, index) => {
				row[rowIndex][index].isActive = item.id === playlistId;
			});
		});

		this.currentPlaylistId = playlistId;

		this.items = this.playlistItems[this.currentPlaylistId];

		this.showItemEvent.emit(typeof itemId === 'undefined' ? 0 : itemId);
	}

	playItem(item) {
		this.playFileEvent.emit(item);
	}

	deleteItem(item) {
		let i = this.items.findIndex(e => e.path === item.path);
		if (i !== -1) {
			this.items.splice(i,1);
		}

		// redraw playlist
		this.showItemEvent.emit(false);
	}

	goToActiveItem() {
		let pos = this._getPlayingItemPos();
		if (pos !== false) {
			this.selectPlaylist(pos.playlistId, pos.pos);
		}
	}

	_getPlayingItemPos() {
		let pos = -1;
		let playlistId = this.currentPlaylistId;

		if (this.currentPlayingItemPath !== '') {
			// find in the current playlist
			pos = this.items.findIndex(e => e.path === this.currentPlayingItemPath);

			if (pos === -1) {
				// find in any playlist
				this.playlistItems.some((item, index) => {
					pos = item.findIndex(e => e.path === this.currentPlayingItemPath);
					if (pos !== -1) {
						playlistId = index;
						return true;
					}
				});
			}
		}

		return pos === -1 ? false : {pos, playlistId};
	}
}