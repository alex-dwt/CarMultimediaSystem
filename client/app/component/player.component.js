/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter, OnInit} from 'angular2/core';
import {PlayerService} from '_app/service/player.service';
import {SettingsService} from '_app/service/settings.service';
import {TrackDurationPipe } from '_app/pipe/trackDuration.pipe';
import {TrackTitlePipe } from '_app/pipe/trackTitle.pipe';
import {ScaleOnClickDirective} from '_app/directive/scaleOnClick.directive';

const CHECK_CURRENT_POSITION_INTERVAL = 2000;
const CHECK_STATUS_INTERVAL = 1500;
const CHECK_DURATION_INTERVAL = 2000;

@Component({
	selector: '[player]',
	template: `
		<div>
			<span class="glyphicon-arrow-down" style="color: grey;" onclick="return false; document.getElementById('player').className = (document.getElementById('player').className == 'minimized' ? '' : 'minimized');"></span>
			<p>Playing ... / Stopped ...</p>
		</div>
		<div>
			<div>
				<div>
					<div [class.playing]="status === STATUS_PLAYING">
						<span scale-on-click class="glyphicon-play" (click)="playBtnClick()"></span>
					</div>
					<div>
						<span scale-on-click class="glyphicon-chevron-left" (click)="playPrevBtnClick()"></span>
						<span scale-on-click class="glyphicon-stop" (click)="stopBtnClick()"></span>
						<span scale-on-click class="glyphicon-chevron-right" (click)="playNextBtnClick()"></span>
					</div>
				</div>
			</div>

			<div>
				<div>
					<span
						scale-on-click
						class="glyphicon-repeat"
						(click)="settingsBtnClick('ReplayBtn')"
						[class.active]="isReplayBtnActive">
					</span>
				</div>
				<div>
					<span
						class="glyphicon-random"
						[class.active]="isShuffleBtnActive">
					</span>
				</div>
				<div>
					<span
						scale-on-click
						class="glyphicon-retweet"
						(click)="settingsBtnClick('CycleBtn')"
						[class.active]="isCycleBtnActive">
					</span>
				</div>
			</div>

			<div>
				<div>
					<h2>{{ currentItem.name }}</h2>
					<h1>{{ currentItem.title | trackTitle }}</h1>
					<div #progressBar scale-on-click class="progress" (click)="rewindClick($event, progressBar)">
						<div class="progress-bar" [style.width]="currentPositionPercent + '%'"></div>
					</div>
					<p [style.visibility]="currentPosition >= 1 ? 'visible' : 'hidden'">{{ currentPosition | trackDuration }}</p>
					<p>{{ currentItem.duration | trackDuration }}</p>
				</div>
			</div>
		</div>
	`,
	directives: [ScaleOnClickDirective],
	inputs: ['playingItemChangedEvent', 'playFileQueueEvent', 'playNextTrackEvent', 'playPrevTrackEvent'],
	outputs: ['changeStatus'],
	pipes: [TrackDurationPipe, TrackTitlePipe]
})
export class PlayerComponent {
	static get parameters() {
		return [	[PlayerService], [SettingsService]];
	}

	constructor(playerService, settingsService) {
		this._playerService = playerService;
		this._settingsService = settingsService;

		this.changeStatus = new EventEmitter();

		this.STATUS_STOPPED = 'stopped';
		this.STATUS_PLAYING = 'playing';
		this.STATUS_PAUSED = 'paused';

		this.currentItem = {name: '', title: '', duration: ''};
		this.nextItem = null;

		this._setStatus(this.STATUS_STOPPED);

		this.isReplayBtnActive = false;
		this.isShuffleBtnActive = false;
		this.isCycleBtnActive = false;
	}

	ngOnInit(){
		this._getCurrentPosition();
		this._getStatus();
		this._getDuration();
		this.playFileQueueEvent.subscribe(item => this.nextItem = Object.assign({}, item));

		// load settings
		this._settingsService.read('currentPlayingItem').then(
			(data) => {
				if (Object.getOwnPropertyNames(data.value).length !== 0) {
					this.playFileQueueEvent.emit(data.value);
				}
			}
		);
		for (let prop of ['isReplayBtnActive', 'isCycleBtnActive']) {
			this._settingsService.read(prop).then(
				(data) => {
					if (typeof data.value === 'boolean') {
						this[prop] = data.value;
					}
				}
			);
		}
	}

	playPrevBtnClick() {
		this.playPrevTrackEvent.emit({ });
	}

	playNextBtnClick() {
		this.playNextTrackEvent.emit({
			isStartFromFirstAllowed: this.isCycleBtnActive
		});
	}

	playBtnClick() {
		if (!this.currentItem.path) {
			return;
		}

		if (this.status === this.STATUS_PLAYING) {
			this._playerService.pause()
				.then(() => this._setStatus(this.STATUS_PAUSED));
		} else if (this.status === this.STATUS_PAUSED) {
			this._playerService.resume()
				.then(() => this._setStatus(this.STATUS_PLAYING));
		} else {
			this.playFileQueueEvent.emit(this.currentItem);
		}
	}

	stopBtnClick() {
		this._playerService.stop().then((res) => {
			this._setStatus(this.STATUS_STOPPED)
		});
	}

	rewindClick(event, progressBar) {
		if (this.status !== this.STATUS_PLAYING) {
			return;
		}

		let width = parseInt(progressBar.clientWidth);
		let pos = parseInt(event.layerX);
		let duration = parseInt(this.currentItem.duration);
		if (width && pos && duration > 1) {
			this._playerService.setPosition(
				Math.min((Math.floor(duration * pos / width) || 1), duration - 1)
			);
		}
	}

	settingsBtnClick(btnName) {
		let key = 'is' + btnName + 'Active';
		this[key] = ! this[key];
		this._settingsService.save(key, this[key]);
	}

	_setCurrentPosition(value) {
		value = parseInt(value) || 0;
		this.currentPosition = value;

		if (parseInt(this.currentItem.duration)) {
			this.currentPositionPercent = Math.min(
				Math.ceil((this.currentPosition * 100) / parseInt(this.currentItem.duration)),
				100
			);
		} else {
			this.currentPositionPercent = 0;
		}
	}

	_setStatus(status, item) {
		switch (status) {
			case this.STATUS_PAUSED:
				break;

			case this.STATUS_PLAYING:
				if (item) {
					this._settingsService.save('currentPlayingItem', item);
					this.playingItemChangedEvent.emit(item);
					this.currentItem = Object.assign({}, item);
					this.currentItem.duration = '';
					this._setCurrentPosition(1);
				}
				break;

			case this.STATUS_STOPPED:
				this._setCurrentPosition(0);
				this.currentItem.duration = '';
				break;

			default:
				throw new Error('Wrong player status.');
		}

		this.status = status;

		this.changeStatus.emit({
			status: this.status,
			fileType: this.currentItem.fileType
		});
	}

	_getCurrentPosition() {
		if (this.status === this.STATUS_PLAYING) {
			this._playerService.getPosition()
				.then((res) => {
					if (res.success) {
						this._setCurrentPosition(parseInt(res.position));
					}
					setTimeout(
						() => this._getCurrentPosition(),
						CHECK_CURRENT_POSITION_INTERVAL
					);
				})
				.catch(() => setTimeout(
					() => this._getCurrentPosition(),
					CHECK_CURRENT_POSITION_INTERVAL
				)
			)
		} else {
			setTimeout(
				() => this._getCurrentPosition(),
				CHECK_CURRENT_POSITION_INTERVAL
			);
		}
	}

	_getStatus() {
		this._playerService.getStatus()
			.then((res) => {
				if (this.nextItem) {
					this._playerService.play(this.nextItem)
						.then(() => {
							this._setStatus(this.STATUS_PLAYING, this.nextItem);
							this.nextItem = null;
						});
				} else if (res.status === this.STATUS_STOPPED
						&& this.status === this.STATUS_PLAYING
				) {
					if (this.isReplayBtnActive) {
						this.playFileQueueEvent.emit(this.currentItem);
					} else {
						this.playNextTrackEvent.emit({
							isStartFromFirstAllowed: this.isCycleBtnActive
						});
					}
				}

				this._setStatus(res.status);

				setTimeout(
					() => this._getStatus(),
					CHECK_STATUS_INTERVAL
				);
			})
			.catch(() => setTimeout(
				() => this._getStatus(),
				CHECK_STATUS_INTERVAL
			)
		)
	}

	_getDuration() {
		if ((this.status === this.STATUS_PLAYING || this.status === this.STATUS_PAUSED)
			&& this.currentItem.duration === ''
		) {
			this._playerService.getDuration()
				.then((res) => {
					if (res.success) {
						this.currentItem.duration = res.duration;
					}
					setTimeout(
						() => this._getDuration(),
						CHECK_DURATION_INTERVAL
					);
				})
				.catch(() => setTimeout(
					() => this._getDuration(),
					CHECK_DURATION_INTERVAL
				)
			);
		} else {
			setTimeout(
				() => this._getDuration(),
				CHECK_DURATION_INTERVAL
			);
		}
	}
}