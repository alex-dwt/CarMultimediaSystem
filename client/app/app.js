/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {bootstrap} from 'angular2/platform/browser';
import {Component, EventEmitter} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';

import {ExplorerService} from '_app/service/explorer.service';
import {HttpService} from '_app/service/http.service'
import {PlayerService} from '_app/service/player.service'

import {AudioTab} from '_app/tab/audio.tab';
import {VideoTab} from '_app/tab/video.tab';
import {NavbarComponent} from '_app/component/navbar.component';
import {PlayerComponent} from '_app/component/player.component';

@Component({
	selector: '[my-app]',
	host: {
		'[class.show-only-player]' : 'isPlayingVideoFile',
	},
	template: `
		<section audio-tab
			class="player-explorer"
			[playFileEvent]="playFileEvent"
			[playNextTrackEvent]="playNextTrackEvent"
			[playPrevTrackEvent]="playPrevTrackEvent"
			[hidden]="activeTabId !== TAB_MUSIC_ID || isPlayingVideoFile">
		</section>

		<section video-tab
			class="player-explorer"
			[playFileEvent]="playFileEvent"
			[playNextTrackEvent]="playNextTrackEvent"
			[playPrevTrackEvent]="playPrevTrackEvent"
			[hidden]="activeTabId !== TAB_MOVIES_ID || isPlayingVideoFile">
		</section>

		<section player id="player"
			[playFileEvent]="playFileEvent"
			[playNextTrackEvent]="playNextTrackEvent"
			[playPrevTrackEvent]="playPrevTrackEvent"
			(changeStatus)="onChangePlayerStatus($event)">
		</section>

		<nav id="navigation"
			[items]="tabs"
			(change)="onChangeMenuTab($event)"
			[hidden]="isPlayingVideoFile">
		</nav>
	`,
	directives: [NavbarComponent, PlayerComponent, AudioTab, VideoTab]
})
class AppComponent {
	constructor() {
		this.TAB_MAIN_ID = 1;
		this.TAB_MUSIC_ID = 2;
		this.TAB_MOVIES_ID = 3;
		this.TAB_CAMERA_ID = 4;
		this.TAB_NAVIGATION_ID = 5;

		this.tabs = [
			{id: this.TAB_MAIN_ID, icon: 'glyphicon-home', label: 'Main'},
			{id: this.TAB_MUSIC_ID, icon: 'glyphicon-cd',  label: 'Music'},
			{id: this.TAB_MOVIES_ID, icon: 'glyphicon-film',  label: 'Movies'},
			{id: this.TAB_CAMERA_ID, icon: 'glyphicon-eye-open',  label: 'Camera'},
			{id: this.TAB_NAVIGATION_ID, icon: 'glyphicon-globe',  label: 'Navigation'}
		];

		this.activeTabId = -1;

		this.playFileEvent = new EventEmitter();
		this.playNextTrackEvent = new EventEmitter();
		this.playPrevTrackEvent = new EventEmitter();

		this.isPlayingVideoFile = false;
	}

	onChangeMenuTab(itemId) {
		this.activeTabId = itemId;
	}

	onChangePlayerStatus(e) {
		this.isPlayingVideoFile = (
			(e.status === 'playing' || e.status === 'paused') && e.fileType === 'video'
		);
	}
}

bootstrap(AppComponent, [HTTP_PROVIDERS, ExplorerService, PlayerService, HttpService]);