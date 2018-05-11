/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {bootstrap} from 'angular2/platform/browser';
import {Component, EventEmitter, enableProdMode} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Subject} from 'rxjs/Subject';

import {ExplorerService} from 'app/service/explorer.service';
import {HttpService} from 'app/service/http.service'
import {PlayerService} from 'app/service/player.service'
import {SettingsService} from 'app/service/settings.service';
import {CameraService} from 'app/service/camera.service';
import {GpsService} from 'app/service/gps.service';
import {SystemService} from 'app/service/system.service';
import {RecorderService} from 'app/service/recorder.service';

import {MainTab} from 'app/tab/main.tab';
import {AudioTab} from 'app/tab/audio.tab';
import {VideoTab} from 'app/tab/video.tab';
import {RecorderTab} from 'app/tab/recorder.tab';
import {CameraTab} from 'app/tab/camera.tab';
import {NavbarComponent} from 'app/component/navbar.component';
import {PlayerComponent} from 'app/component/player.component';

@Component({
	selector: 'body',
	host: {
		'[class.black]' : 'isPlayingVideoFile',
	},
	template: `
		<div>
			<div id="video-background"
				[hidden]="!isPlayingVideoFile"
				(click)="onVideoBackgroundClick()">
			</div>

			<section main-tab
				class="common-tab"
				[hidden]="activeTabId !== TAB_MAIN_ID || isPlayingVideoFile">
			</section>

			<section audio-tab
				class="common-tab player-explorer"
				[deleteItemSubject]="deleteItemSubject"
				[playFileQueueEvent]="playFileQueueEvent"
				[playingItemChangedEvent]="playingItemChangedEvent"
				[playNextTrackEvent]="playNextTrackEvent"
				[playPrevTrackEvent]="playPrevTrackEvent"
				[hidden]="activeTabId !== TAB_MUSIC_ID || isPlayingVideoFile">
			</section>

			<section video-tab
				class="common-tab player-explorer"
				[deleteItemSubject]="deleteItemSubject"
				[playFileQueueEvent]="playFileQueueEvent"
				[playingItemChangedEvent]="playingItemChangedEvent"
				[playNextTrackEvent]="playNextTrackEvent"
				[playPrevTrackEvent]="playPrevTrackEvent"
				[hidden]="activeTabId !== TAB_MOVIES_ID || isPlayingVideoFile">
			</section>

			<section camera-tab
				*ngIf="activeTabId === TAB_CAMERA_ID && !isPlayingVideoFile">
			</section>
			
			<section recorder-tab
				class="common-tab"
				[hidden]="activeTabId !== TAB_RECORDER_ID || isPlayingVideoFile">
			</section>

			<section player id="player"
				[playFileQueueEvent]="playFileQueueEvent"
				[playingItemChangedEvent]="playingItemChangedEvent"
				[playNextTrackEvent]="playNextTrackEvent"
				[playPrevTrackEvent]="playPrevTrackEvent"
				[deleteItemSubject]="deleteItemSubject"
				[hidden]="(!isPlayerVideoTransparent && isPlayingVideoFile) || activeTabId === TAB_CAMERA_ID"
				(changeStatus)="onChangePlayerStatus($event)">
			</section>

			<nav id="navigation"
				[activeTab]="TAB_MAIN_ID"
				[items]="tabs"
				(change)="onChangeMenuTab($event)"
				[hidden]="isPlayingVideoFile">
			</nav>
		</div>
	`,
	directives: [NavbarComponent, PlayerComponent, AudioTab, VideoTab, CameraTab, RecorderTab, MainTab]
})
class AppComponent {
	static get parameters() {
		return [	[PlayerService]];
	}

	constructor(playerService) {
		this._playerService = playerService;

		this.TAB_MAIN_ID = 1;
		this.TAB_MUSIC_ID = 2;
		this.TAB_MOVIES_ID = 3;
		this.TAB_CAMERA_ID = 4;
		this.TAB_RECORDER_ID = 5;
		this.TAB_NAVIGATION_ID = 6;

		this.tabs = [
			{id: this.TAB_MAIN_ID, icon: 'glyphicon-home'},
			{id: this.TAB_MUSIC_ID, icon: 'glyphicon-cd'},
			{id: this.TAB_MOVIES_ID, icon: 'glyphicon-film'},
			{id: this.TAB_CAMERA_ID, icon: 'glyphicon-eye-open'},
			{id: this.TAB_RECORDER_ID, icon: 'glyphicon-facetime-video'},
			{id: this.TAB_NAVIGATION_ID, icon: 'glyphicon-globe'}
		];

		this.activeTabId = this.TAB_MAIN_ID;

		this.playFileQueueEvent = new EventEmitter();
		this.playingItemChangedEvent = new EventEmitter();
		this.playNextTrackEvent = new EventEmitter();
		this.playPrevTrackEvent = new EventEmitter();
		this.deleteItemSubject = new Subject();

		this.isPlayingVideoFile = false;
		this.isPlayerVideoTransparent = false;
	}

	onChangeMenuTab(itemId) {
		this.activeTabId = itemId;
	}

	onChangePlayerStatus(e) {
		this.isPlayingVideoFile = (
			(e.status === 'playing' || e.status === 'paused') && e.fileType === 'video'
		);
	}

	onVideoBackgroundClick() {
		this._playerService
			.setAlpha(this.isPlayerVideoTransparent ? 255 : 100)
			.then(() => this.isPlayerVideoTransparent = !this.isPlayerVideoTransparent);
	}
}

let boot = document.addEventListener('DOMContentLoaded', () => {
    enableProdMode();

    bootstrap(AppComponent, [
        HTTP_PROVIDERS,
        SettingsService,
        ExplorerService,
        PlayerService,
        CameraService,
        RecorderService,
        GpsService,
        SystemService,
        HttpService
    ]);
});

module.exports = boot;