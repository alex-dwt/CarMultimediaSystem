/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter} from 'angular2/core';

import {ExplorerService} from '_app/service/explorer.service';
import {TrackDurationPipe } from '_app/pipe/trackDuration.pipe';
import {TrackTitlePipe } from '_app/pipe/trackTitle.pipe';
import {PagingComponent} from '_app/component/paging.component';
import {ScaleOnClickDirective} from '_app/directive/scaleOnClick.directive';
import {UnderlineOnClickDirective} from '_app/directive/underlineOnClick.directive';
import {ChangeColorOnClick} from '_app/directive/changeColorOnClick.directive';

const DEFAULT_PATH ='/';

@Component({
	selector: '[explorer]',
	template: `
		<div class="panel-label">
			<p>Explorer</p>
		</div>

		<ul class="items-box">
			<li *ngFor="let item of currentItems" class="explorer-row" [class.delete-process]="item.isWantToDelete">
				<div class="info-block">
					<template [ngIf]="!isFileItem(item)">
						<span class="glyphicon-folder-close"></span>
						<p class="dir-badge">{{ isParentDir(item) ? '' : item.filesCount }}</p>
					</template>
					<template [ngIf]="isFileItem(item)">
						<span class="glyphicon">&nbsp;</span>
						<p class="dir-badge length-badge">{{ item.duration | trackDuration }}</p>
					</template>
				</div>

				<div underline-on-click *ngIf="!isFileItem(item)" class="name-block" (click)="selectDirectory(item.path)">
					<span>{{ isParentDir(item) ? '. . .' : item.dirName }}</span>
				</div>
				<div underline-on-click *ngIf="isFileItem(item)" class="name-block file-name-block" (click)="playItem(item)">
					<p><span>{{ item.name }}</span></p>
					<p>{{ item.title | trackTitle }}</p>
				</div>

				<div class="actions-block">
					<div>
						<span
							scale-on-click
							change-color-on-click
							class="glyphicon-plus-sign"
							(click)="addItemToPlaylist(item)"
							[class.display-none]="isParentDir(item)">
						</span>
					</div>
					<div>
						<span
							class="glyphicon-remove-circle"
							(click)="item.isWantToDelete=true"
							[class.display-none]="isParentDir(item)">
						</span>
					</div>
					<div class="delete-block">
						<p>Are you sure?</p>
						<div><span change-color-on-click class="glyphicon-ok" (click)="deleteItem(item)"></span></div>
						<div><span class="glyphicon-remove" (click)="item.isWantToDelete=false"></span></div>
					</div>
				</div>
			</li>
		</ul>

		<section class="panel-paging-common">
			<div scale-on-click class="refresh-cur-dir" (click)="selectDirectory()">
				<span class="glyphicon-refresh"></span>
			</div>

			<div paging
				(change)="onCurrentItemsChange($event)"
				[items]="items"
				[itemsPerPage]="itemsPerPage">
			</div>

		</section>
	`,
	directives: [PagingComponent, ScaleOnClickDirective, UnderlineOnClickDirective, ChangeColorOnClick],
	inputs: ['fileType', 'playFileQueueEvent', 'addFileEvent', 'deleteItemSubject'],
	pipes: [TrackDurationPipe, TrackTitlePipe]
})
export class ExplorerComponent {
	static get parameters() {
		return [[ExplorerService]];
	}

	constructor(explorerService) {
		this._explorerService = explorerService;

		this.items = [];
		this.currentItems = [];
		this.itemsPerPage = 4;

		this.currentPath = DEFAULT_PATH;
	}

    ngOnInit(){
        this.deleteItemSubject.subscribe((item) => {
            if (!item.canBeRemoved
				|| item.item.fileType !== this.fileType
			) {
                return;
            }

			this._explorerService
				.deleteFile(item.item.fileType, item.item.path)
				.then(() => this.selectDirectory())
				.catch(() => this.selectDirectory());
		});
    }

	isFileItem(item) {
		return typeof item.fileName !== 'undefined';
	}

	isParentDir(item) {
		return item.isParentDir;
	}

	isPreviousDirectory(item) {
		return typeof item.isPreviousDirectory !== 'undefined';
	}

	addItemToPlaylist(item) {
		if (this.isFileItem(item)) {
			this.addFileEvent.emit(item);
		} else if (!this.isParentDir(item)) {
			this._explorerService
				.getDirectoryContent(this.fileType, item.path)
				.then((res) => {
					for (let item of res.files) {
						this.addFileEvent.emit(item);
					}
				});
		}
	}

	playItem(item) {
		// play file
		if (this.isFileItem(item)) {
			this.playFileQueueEvent.emit(item);
		}
	}

	deleteItem(item) {
		if (!this.isParentDir(item)) {
            this.deleteItemSubject.next({
            	item,
				canBeRemoved: false
            });
		}
	}

	selectDirectory(path = this.currentPath) {
		this._explorerService.getDirectoryContent(this.fileType, path).then((res) => {
			this.currentPath = path;

			let dirs = [];

			dirs = dirs.concat(res.dirs);

			this.items = dirs.concat(res.files);/*.map((item) => {
				item.isWantToDelete = false;
				return item;
			});*/
		});
	}

	onCurrentItemsChange(currentItems) {
		this.currentItems = currentItems.map((item) => {
			item.isWantToDelete = false;
			return item;
		});
	}
}
