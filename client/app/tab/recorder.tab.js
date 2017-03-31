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
            <div>            
                <section id="recorder-status-block" class="two-row-status-block pull-left">
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
        this.recorderCurrentFile = '-';
        this.recorderCurrentFps = '-';

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

    isCanBeSaved(item) {
        return item.canBeSaved || false;
    }

    isCanBeDeleted(item) {
        return item.canBeDeleted || false;
    }

    saveDir(item) {
        // todo
        console.log('save');
    }

    deleteDir(item) {
        // todo
        item.isWantToDelete=false;
        console.log('delete');
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

    onDirsItemsChange(paginatedItems, type) {
        this.explorerItems
            .find(o => o.type === type)
            .paginatedItems = paginatedItems.map((item) => {
                item.isWantToDelete = false;
                return item;
            });
    }
}
