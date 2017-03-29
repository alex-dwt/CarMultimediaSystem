/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter} from 'angular2/core';
import {RecorderService} from '_app/service/recorder.service';
import {ScaleOnClickDirective} from '_app/directive/scaleOnClick.directive';

const GET_STATUS_DELAY = 3;
let statusTimeout;

@Component({
	selector: '[recorder-tab]',
	template: `
		<section id="recorder-status-block" class="two-row-status-block">
		    <span class="glyphicon recorder-action-btn"
                scale-on-click
                (click)="toggleRecorder()"
                [class.glyphicon-play]="! isRecorderWorking"
                [class.glyphicon-stop]="isRecorderWorking">
            </span>
            <div>
                <div class="left-block">
                    <p>Active:</p>
                    <p>Fps:</p>
                    <p>File:</p>
                </div>
                <div class="right-block">
                    <p>
                        <span class="status glyphicon"
                            [class.active]="isRecorderWorking"
                            [class.glyphicon-ban-circle]="! isRecorderWorking"
                            [class.glyphicon-ok]="isRecorderWorking">
                        </span>
                    </p>
                    <p>{{ recorderCurrentFps }}</p>
                    <p>{{ recorderCurrentFile }}</p>
                </div>
            </div>
		</section>	
		
		<section id="recorder-explorer">
			<section></section>
			<section></section>
		</section>
	`,
    directives: [ScaleOnClickDirective]
})
export class RecorderTab {
    static get parameters() {
        return [[RecorderService]];
    }

    constructor(RecorderService) {
        this._recorderService = RecorderService;

        this.isRecorderWorking = false;
        this.recorderCurrentFile = '-';
        this.recorderCurrentFps = '-';
    }

    ngOnInit(){
        this.getStatus();
    }

    getStatus() {
        this._recorderService
			.getRecordingStatus()
			.then((data) => this.updateStatus(data))
			.catch(() => this.updateStatus());
    }

    toggleRecorder() {
        let func = this.isRecorderWorking
            ? 'stopRecording'
            : 'startRecording';

            this._recorderService[func]()
                .then(() => this._recorderService.getRecordingStatus())
                .then((data) => this.updateStatus(data))
                .catch(() => this.updateStatus());
    }

    updateStatus(data) {
        clearTimeout(statusTimeout);

        this.recorderCurrentFile = data.currentFile || '-';
        this.recorderCurrentFps = data.currentFps || '-';
        this.isRecorderWorking = (typeof data.isWorking !== 'undefined')
			? !! data.isWorking
			: false;

        statusTimeout = window.setTimeout(
            () => this.getStatus(),
            GET_STATUS_DELAY * 1000
        );
	}
}
