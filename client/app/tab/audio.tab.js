/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter} from 'angular2/core';

import {PlaylistComponent} from 'app/component/playlist.component';
import {ExplorerComponent} from 'app/component/explorer.component';

@Component({
	selector: '[audio-tab]',
	template: `
		<section explorer
			[class.active]="isExplorerActive"
			[fileType]="'audio'"
			[addFileEvent]="addFileEvent"
			[playFileQueueEvent]="playFileQueueEvent"
			[deleteItemSubject]="deleteItemSubject"
			(click)="isExplorerActive=true">
		</section>
		<section playlist
			[class.inactive]="isExplorerActive"
			[fileType]="'audio'"
			[addFileEvent]="addFileEvent"
			[playingItemChangedEvent]="playingItemChangedEvent"
			[playFileQueueEvent]="playFileQueueEvent"
			[playNextTrackEvent]="playNextTrackEvent"
			[playPrevTrackEvent]="playPrevTrackEvent"
			[deleteItemSubject]="deleteItemSubject"
			(click)="isExplorerActive=false">
		</section>
	`,
	directives: [ExplorerComponent, PlaylistComponent],
	inputs: ['playingItemChangedEvent', 'playFileQueueEvent', 'playNextTrackEvent', 'playPrevTrackEvent', 'deleteItemSubject']
})
export class AudioTab {
	constructor() {
		this.isExplorerActive = false;
		this.addFileEvent = new EventEmitter();
	}
}