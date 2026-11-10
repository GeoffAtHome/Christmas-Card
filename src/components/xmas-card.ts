/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, TemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import { connect } from 'pwa-helpers';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import {
  CardItem,
  CardSide,
  XmasCardData,
  destLarge,
  destSmall,
} from './card-type';
import { popupImage, popupMouseMove } from '../actions/app';
import { RootState, store } from '../store';
import { thisYear } from '../years';

import './popup-image';
import { imageLoaded } from './data-image';

@customElement('xmas-card')
export class XmasCard extends connect(store)(LitElement) {
  @property({ type: Object })
  public xmasCardData!: XmasCardData;

  @property({ type: String })
  private year: string = thisYear.toString();

  @property({ type: String })
  private side: CardSide = 'front';

  protected render() {
    if (this.xmasCardData !== undefined) {
      const cardGrid = this.xmasCardData[this.side].cardGrid;
      return html`
        <div class="card-image-container">
          <img
            id="image"
            width="${cardGrid.m}"
            height="${cardGrid.n}"
            large="${this.xmasCardData.images}/${this.side}/${destLarge}.webp"
            src="data:image/webp;base64,${cardGrid.d}"
            alt="${cardGrid.t}"
            @load=${imageLoaded}
          />
          ${this.xmasCardData[this.side].cardData.map(
            (item: CardItem, index: number) =>
              this.addArea(item, index)
          )}
        </div>
      `;
    }
    return html``;
  }

  addArea(
    entry: CardItem,
    index: number
  ): TemplateResult {
    let xPos = entry.x;
    let yPos = entry.y;
    let width = xPos + entry.w;
    let height = yPos + entry.h;

    if (entry.x < this.xmasCardData![this.side].cardGrid.x) {
      const factorX =
        this.xmasCardData![this.side].cardGrid.w /
        this.xmasCardData![this.side].cardGrid.x;
      const factorY =
        this.xmasCardData![this.side].cardGrid.h /
        this.xmasCardData![this.side].cardGrid.y;
      xPos = entry.x * factorX;
      yPos = entry.y * factorY;
      width = (entry.x + entry.w) * factorX;
      height = (entry.y + entry.h) * factorY;
    }

    const { w: imageWidth, h: imageHeight } =
      this.xmasCardData![this.side].cardGrid;
    const left = (xPos / imageWidth) * 100;
    const top = (yPos / imageHeight) * 100;
    const areaWidth = ((width - xPos) / imageWidth) * 100;
    const areaHeight = ((height - yPos) / imageHeight) * 100;

    return html`<a
      class="image-area"
      index=${index}
      @mouseenter=${this._ShowImage}
      @mouseleave=${this._HideImage}
      @mousemove=${this._moveMouse}
      style="left:${left}%;top:${top}%;width:${areaWidth}%;height:${areaHeight}%;"
      aria-label="${entry.t}"
      href="#${this.year}#image#${this.side}#${index}"
    ></a>`;
  }

  stateChanged(state: RootState) {
    this.xmasCardData = state.app!.xmasCardData;
    this.year = state.app!.year;
    this.side = state.app!.side;
  }

  _ShowImage(event: MouseEvent) {
    const target = event.target as any;
    const index = Number(target.getAttribute('index'));

    if (this.xmasCardData !== undefined) {
      const currentImage = `${this.xmasCardData.images}/${this.side}/${destSmall}/${index}.webp`;
      const currentImageData = this.xmasCardData[this.side].cardData[index].d;
      const currentImageWidth = this.xmasCardData[this.side].cardData[index].m;
      const currentImageHeight = this.xmasCardData[this.side].cardData[index].n;
      const currentText = this.xmasCardData[this.side].cardData[index].t;

      store.dispatch(
        popupImage(
          currentImage,
          currentImageData,
          currentImageWidth,
          currentImageHeight,
          currentText
        )
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private _moveMouse(event: MouseEvent) {
    store.dispatch(popupMouseMove(event.pageX, event.pageY));
  }

  // eslint-disable-next-line class-methods-use-this
  private _HideImage(_event: MouseEvent) {
    store.dispatch(popupImage('', '', 0, 0, ''));
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: calc(100vh - 64px);
          max-height: calc(100vh - 64px);
          min-height: calc(100vh - 64px);
          max-width: 100%;
        }

        .card-image-container {
          position: relative;
          display: inline-block;
          line-height: 0;
          max-width: 99vw;
          max-height: calc(100vh - 64px);
        }

        img {
          display: block;
          width: auto;
          height: auto;
          max-width: 99vw;
          max-height: calc(100vh - 64px);
        }

        .image-area {
          position: absolute;
          display: block;
          z-index: 1;
        }

      `,
    ];
  }
}
