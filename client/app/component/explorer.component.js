/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter} from 'angular2/core';
import {ExplorerService} from '_app/service/explorer.service';
import {TrackDurationPipe } from '_app/pipe/trackDuration.pipe';
import {TrackTitlePipe } from '_app/pipe/trackTitle.pipe';

const ITEMS_PER_PAGE = 4;
const DEFAULT_PATH ='/';

@Component({
	selector: '[explorer]',
	template: `
		<div class="panel-label">
			<p>Explorer</p>
		</div>

		<ul>
			<li *ngFor="let item of currentItems" class="explorer-row" [class.delete-process]="item.isWantToDelete">
				<div class="info-block">
					<template [ngIf]="!isFileItem(item)">
						<span class="glyphicon-folder-close" aria-hidden="true" (click)="selectDirectory(item.path)"></span>
						<span class="dir-badge" (click)="selectDirectory(item.path)">{{ item.is_parent_dir ? '' : item.files_count }}</span>
					</template>
					<template [ngIf]="isFileItem(item)">
						<span class="glyphicon" aria-hidden="true">&nbsp;</span>
						<span class="dir-badge length-badge">{{ item.duration | trackDuration }}</span>
					</template>
				</div>

				<div *ngIf="!isFileItem(item)" class="name-block" (click)="selectDirectory(item.path)">
					<span>{{ item.is_parent_dir ? '. . .' : item.dir_name }}</span>
				</div>
				<div *ngIf="isFileItem(item)" class="name-block file-name-block">
					<p>{{ item.name }}</p>
					<p>{{ item.title | trackTitle }}</p>
				</div>

				<div class="actions-block">
					<div><span class="glyphicon-play-circle" aria-hidden="true" (click)="playItem(item)"></span></div>
					<div><span class="glyphicon-plus-sign" aria-hidden="true" (click)="addItemToPlaylist(item)"></span></div>
					<div><span class="glyphicon-remove-circle" aria-hidden="true" (click)="item.isWantToDelete=true"></span></div>
					<div class="delete-block">
						<p>Are you sure?</p>
						<div><span class="glyphicon-ok" aria-hidden="true" (click)="deleteItem(item)"></span></div>
						<div><span class="glyphicon-remove" aria-hidden="true" (click)="item.isWantToDelete=false"></span></div>
					</div>
				</div>
			</li>
		</ul>

		<section class="panel-paging">
			<div class="active show-only-files" [class.active]="isShowOnlyFiles" (click)="showOnlyFiles()">
				<span class="glyphicon-align-justify" aria-hidden="true"></span>
			</div>


			<span class="glyphicon-arrow-left" aria-hidden="true" [style.visibility]="currentItemsFrom <= 1 ? 'hidden' : 'visible'" (click)="prevPage()"></span>
			<p>{{ currentItemsFrom }}-{{ currentItemsTill }} of {{ items.length }}</p>
			<span class="glyphicon-arrow-right" aria-hidden="true" [style.visibility]="currentItemsTill >= items.length ? 'hidden' : 'visible'" (click)="nextPage()"></span>


		</section>
	`,
	inputs: ['playFileEvent', 'addFileEvent', 'addDirectoryEvent'],
	pipes: [TrackDurationPipe, TrackTitlePipe]
})
export class ExplorerComponent {
	static get parameters() {
		return [[ExplorerService]];
	}

	constructor(explorerService) {
		this._explorerService = explorerService;
		this.currentItems = [];
		this.items = [];
		this.currentItemsFrom = 0;
		this.currentItemsTill = 0;
		this.isShowOnlyFiles = false;
		this.currentPath = DEFAULT_PATH;
	}

	isFileItem(item) {
		return typeof item.file_name !== 'undefined';
	}

	isPreviousDirectory(item) {
		return typeof item.isPreviousDirectory !== 'undefined';
	}

	addItemToPlaylist(item) {
		console.log('addItemToPlaylist');
		if (this.isFileItem(item)) {
			this.addFileEvent.emit({
				title: item.title,
				name: item.name,
				path: this.currentPath + '/' + item.file_name,
				duration: item.duration,
			});
		} else {
			this.addDirectoryEvent.emit({
				dir: 'addDirectoryEvent'
			});
		}
	}

	playItem(item) {
		// play file
		if (this.isFileItem(item)) {
			this.playFileEvent.emit({
				title: item.title,
				name: item.name,
				path: this.currentPath + '/' + item.file_name
			});
			console.log('explorer play file');
		}
	}



	deleteItem(item) {
		console.log('delete-item');
		this.selectDirectory();
	}

	showOnlyFiles() {
		this.isShowOnlyFiles = !this.isShowOnlyFiles;
		this.selectDirectory();
	}

	selectDirectory(path = this.currentPath) {
		this._explorerService.getDirectoryContent(path).then((res) => {
			this.currentPath = path

			let dirs = [];

			//if (this.currentPath !== DEFAULT_PATH) {
			//	dirs.push({
			//		isPreviousDirectory: true,
			//	});
			//}

			//if (!this.isShowOnlyFiles) {
				dirs = dirs.concat(res.dirs);
			//}

			this.items = dirs.concat(res.files).map((item) => {
				item.isWantToDelete = false;
				return item;
			});

			this.firstPage();
		});
	}









	firstPage() {
		if (!this.items.length) {
			this.currentItemsFrom = 0;
			this.currentItemsTill = 0;
		} else {
			this.currentItemsFrom = 1;
			this.currentItemsTill = Math.min(ITEMS_PER_PAGE, this.items.length);
		}
		this.render();
	}

	nextPage() {
		if (this.items.length <= this.currentItemsTill) {
			return;
		}
		this.currentItemsFrom = this.currentItemsTill + 1;
		this.currentItemsTill = Math.min(this.currentItemsFrom + ITEMS_PER_PAGE - 1, this.items.length);
		this.render();
	}

	prevPage() {
		if (this.currentItemsFrom <= 1) {
			return;
		}
		this.currentItemsFrom = Math.max(1, this.currentItemsFrom - ITEMS_PER_PAGE);
		this.currentItemsTill = Math.min(this.currentItemsFrom + ITEMS_PER_PAGE - 1, this.items.length);
		this.render();
	}

	render() {
		if (this.currentItemsFrom && this.currentItemsTill) {
			this.currentItems = this.items.slice(
				this.currentItemsFrom - 1,
				this.currentItemsTill
			).map((item) => {
				item.isWantToDelete = false;
				return item;
			});
		} else {
			this.currentItems = [];
		}
	}
}