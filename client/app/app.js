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

import {ExplorerComponent} from '_app/component/explorer.component';
import {NavbarComponent} from '_app/component/navbar.component';
import {PlayerComponent} from '_app/component/player.component';
import {PlaylistComponent} from '_app/component/playlist.component';

const TAB_MAIN = 1;
const TAB_MUSIC = 2;
const TAB_MOVIES = 3;
const TAB_CAMERA = 4;
const TAB_NAVIGATION = 5;
const TABS = [
	{id: TAB_MAIN, icon: 'glyphicon-home', label: 'Main'},
	{id: TAB_MUSIC, icon: 'glyphicon-cd',  label: 'Music'},
	{id: TAB_MOVIES, icon: 'glyphicon-film',  label: 'Movies'},
	{id: TAB_CAMERA, icon: 'glyphicon-eye-open',  label: 'Camera'},
	{id: TAB_NAVIGATION, icon: 'glyphicon-globe',  label: 'Navigation'}
];

@Component({
	selector: '[my-app]',
	template: `
		<section id="player-explorer" [class.show-explorer]="isExplorerActive">
			<section explorer id="explorer"
				[playFileEvent]="playFileEvent"
				[addFileEvent]="addFileEvent"
				[addDirectoryEvent]="addDirectoryEvent"
				(click)="isExplorerActive=true">
			</section>
			<section playlist id="playlist"
				[playFileEvent]="playFileEvent"
				[addFileEvent]="addFileEvent"
				[addDirectoryEvent]="addDirectoryEvent"
				[playNextTrackEvent]="playNextTrackEvent"
				(click)="isExplorerActive=false">
			</section>
		</section>
		<section player id="player" [playFileEvent]="playFileEvent" [playNextTrackEvent]="playNextTrackEvent"></section>
		<nav id="navigation" [items]="tabs" (change)="onChangeMenuTab($event)"></nav>
	`,
	directives: [ExplorerComponent, NavbarComponent, PlayerComponent, PlaylistComponent]
})
class AppComponent {
	constructor() {
		this.tabs = TABS;
		this.activeTabId = -1;
		this.isExplorerActive = false;

		this.playFileEvent = new EventEmitter();
		this.addFileEvent = new EventEmitter();
		this.addDirectoryEvent = new EventEmitter();
		this.playNextTrackEvent = new EventEmitter();
	}

	onChangeMenuTab(itemId) {
		this.activeTabId = itemId;
		console.log(itemId)
	}
}

bootstrap(AppComponent, [HTTP_PROVIDERS, ExplorerService, PlayerService, HttpService]);