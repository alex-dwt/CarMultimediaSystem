/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import {Component, EventEmitter, OnChanges, OnInit} from 'angular2/core';

@Component({
	selector: '[paging]',
	template: `
		<span class="glyphicon-arrow-left"
		 	aria-hidden="true"
			[style.visibility]="currentItemsFrom <= 1 ? 'hidden' : 'visible'"
			(click)="prevPage()">
		</span>
		<p>{{ currentItemsFrom }}-{{ currentItemsTill }} of {{ items.length }}</p>
		<span class="glyphicon-arrow-right"
			aria-hidden="true"
			[style.visibility]="currentItemsTill >= items.length ? 'hidden' : 'visible'"
			(click)="nextPage()">
		</span>
	`,
	inputs: ['items', 'itemsPerPage', 'showItemEvent'],
	outputs: ['change']
})
export class PagingComponent {
	constructor() {
		this.currentItems = [];
		this.currentItemsFrom = 0;
		this.currentItemsTill = 0;

		this.change = new EventEmitter();
	}

	ngOnInit(){
		if (this.showItemEvent) {
			this.showItemEvent.subscribe(itemPos => {
				if (itemPos !== false) {
					let page = Math.ceil((itemPos + 1) / this.itemsPerPage);
					this.currentItemsFrom = ((page - 1) * this.itemsPerPage) + 1;
				}

				this._checkPagination();
				this._render();
			});
		}
	}

	ngOnChanges(){
		if (!this.showItemEvent) {
			this._checkPagination();
			this._render();
		}
	}

	nextPage() {
		if (this.items.length <= this.currentItemsTill) {
			return;
		}
		this.currentItemsFrom = this.currentItemsTill + 1;
		this.currentItemsTill = Math.min(this.currentItemsFrom + this.itemsPerPage - 1, this.items.length);
		this._render();
	}

	prevPage() {
		if (this.currentItemsFrom <= 1) {
			return;
		}
		this.currentItemsFrom = Math.max(1, this.currentItemsFrom - this.itemsPerPage);
		this.currentItemsTill = Math.min(this.currentItemsFrom + this.itemsPerPage - 1, this.items.length);
		this._render();
	}

	_checkPagination() {
		if (!this.items.length) {
			this.currentItemsFrom = 0;
			this.currentItemsTill = 0;
		} else if (this.currentItemsFrom && this.currentItemsFrom <= this.items.length) {
			this.currentItemsTill = Math.min(this.currentItemsFrom + this.itemsPerPage - 1, this.items.length);
		} else {
			this.currentItemsFrom = Math.max(1, this.currentItemsFrom - this.itemsPerPage);
			this.currentItemsTill = Math.min(this.currentItemsFrom + this.itemsPerPage - 1, this.items.length);
		}
	}

	_render() {
		let currentItems = [];

		if (this.currentItemsFrom && this.currentItemsTill) {
			currentItems = this.items.slice(
				this.currentItemsFrom - 1,
				this.currentItemsTill
			);
		}

		this.change.emit(currentItems);
	}
}