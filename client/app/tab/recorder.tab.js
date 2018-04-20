/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter} from 'angular2/core';
import {RecorderService} from '_app/service/recorder.service';
import {ScaleOnClickDirective} from '_app/directive/scaleOnClick.directive';
import {PagingComponent} from '_app/component/paging.component';
import {ChangeColorOnClick} from '_app/directive/changeColorOnClick.directive';

const GET_STATUS_DELAY = 3;
const EXPLORER_TYPES = [
    'current',
    'saved'
];
let statusTimeout;

@Component({
	selector: '[recorder-tab]',
	template: `
        <div>
            <div id="recorder-status">
                <section class="two-row-status-block">
                    <span class="glyphicon recorder-action-btn"
                        scale-on-click
                        (click)="toggle(true)"
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
                            <p>{{ recorderFps }}</p>
                            <p>{{ recorderFile }}</p>
                        </div>
                    </div>
                </section>
                <section class="two-row-status-block">
                    <span class="glyphicon recorder-action-btn"
                        scale-on-click
                        (click)="toggle(false)"
                        [class.glyphicon-play]="! isConverterWorking"
                        [class.glyphicon-stop]="isConverterWorking">
                    </span>
                    <div>
                        <div class="left-block">
                            <p>Active:</p>
                            <p>Progress:</p>
                            <p>File:</p>
                        </div>
                        <div class="right-block">
                            <p>
                                <span class="status glyphicon"
                                    [class.active]="isConverterWorking"
                                    [class.glyphicon-ban-circle]="! isConverterWorking"
                                    [class.glyphicon-ok]="isConverterWorking">
                                </span>
                            </p>
                            <p>{{ converterProgress }}</p>
                            <p>{{ converterFile }}</p>
                        </div>
                    </div>
                </section>	
            </div>
            
            <div id="recorder-explorer">
                <div *ngFor="let explorerItem of explorerItems; let i = index;">
                    <ul class="items-box">
                        <li *ngFor="let item of explorerItem.paginatedItems" [class.delete-process]="item.isWantToDelete">
                            <span>{{ item.name }}</span>
                            <span 
                                class="recorder-explorer-btn glyphicon glyphicon-save-file"
                                scale-on-click
                                [class.display-inline]="isCanBeSaved(item)"
                                (click)="saveDir(item)">
                            </span>
                            <span 
                                class="recorder-explorer-btn glyphicon glyphicon-remove"
                                (click)="item.isWantToDelete=true"
                                [class.display-inline]="isCanBeDeleted(item)">
                            </span>
                            <span class="delete-block">
                                Are you sure?
                                <span change-color-on-click class="glyphicon display-inline recorder-explorer-btn glyphicon-ok"
                                    (click)="deleteDir(item)">
                                </span>
                                <span class="glyphicon display-inline recorder-explorer-btn glyphicon-remove"
                                    (click)="item.isWantToDelete=false">
                                </span>
                            </span>
                        </li>
                    </ul>
                    
                    <section class="panel-paging-common">
                        <div
                            *ngIf="i == 0"
                            scale-on-click 
                            class="refresh-cur-dir"
                             (click)="getDirs()">
                            <span class="glyphicon-refresh"></span>
                        </div>
                        <div paging
                            (change)="onDirsItemsChange($event, explorerItem.type)"
                            [items]="explorerItem.items"
                            [itemsPerPage]="itemsPerPage">
                        </div>
                    </section>
                </div>
            </div>
        </div>
	`,
    directives: [ScaleOnClickDirective, PagingComponent, ChangeColorOnClick]
})
export class RecorderTab {
    static get parameters() {
        return [[RecorderService]];
    }

    constructor(RecorderService) {
        this._recorderService = RecorderService;

        // recorder
        this.isRecorderWorking = false;
        this.recorderFile = '-';
        this.recorderFps = '-';

        // converter
        this.isConverterWorking = false;
        this.converterFile = '-';
        this.converterProgress = '-';

        // explorer
        this.itemsPerPage = 3;
        this.explorerItems = [];
        for (let type of EXPLORER_TYPES) {
            this.explorerItems.push({
                type,
                items: [],
                paginatedItems: []
            });
        }
    }

    ngOnInit(){
        this.getStatus();
    }

    getStatus() {
        this._recorderService
			.getStatus()
			.then((data) => this.updateStatus(data))
			.catch(() => this.updateStatus());
    }

    toggle(isToggleRecorder) {
        let func = isToggleRecorder
            ? (
                this.isRecorderWorking
                    ? 'stopRecording'
                    : 'startRecording'
            ) : (
                this.isConverterWorking
                    ? 'stopConverting'
                    : 'startConverting'
            );

            this._recorderService[func]()
                .then(() => this._recorderService.getStatus())
                .then((data) => this.updateStatus(data))
                .catch(() => this.updateStatus());
    }

    updateStatus(data = {}) {
        clearTimeout(statusTimeout);

        this.recorderFile = data.recorder.currentFile || '-';
        this.recorderFps = data.recorder.currentFps || '-';
        this.isRecorderWorking = (typeof data.recorder.isWorking !== 'undefined')
			? !! data.recorder.isWorking
			: false;

        this.converterFile = data.converter.currentFile || '-';
        this.converterProgress = data.converter.currentProgress || '-';
        this.isConverterWorking = (typeof data.converter.isWorking !== 'undefined')
			? !! data.converter.isWorking
			: false;

        statusTimeout = window.setTimeout(
            () => this.getStatus(),
            GET_STATUS_DELAY * 1000
        );
	}

    isCanBeSaved(item) {
        return item.canBeSaved || false;
    }

    isCanBeDeleted(item) {
        return item.canBeDeleted || false;
    }

    saveDir(item) {
        this._recorderService.saveDir(item.dirName).then(() => {
            this.getDirs()
        });
    }

    deleteDir(item) {
        item.isWantToDelete=false;
        this._recorderService.deleteDir(item.dirName).then(() => {
            this.getDirs()
        });
    }

    getDirs() {
        this._recorderService.getDirs().then((data) => {
            for (let type of EXPLORER_TYPES) {
                this.explorerItems
                    .find(o => o.type === type)
                    .items = data[type] || [];
            }
        });
    }

    onDirsItemsChange(event, type) {
        this.explorerItems
            .find(o => o.type === type)
            .paginatedItems = event.items.map((item) => {
                item.isWantToDelete = false;
                return item;
            });
    }
}
