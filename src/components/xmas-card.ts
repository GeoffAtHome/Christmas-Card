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
import { CardItem, CardSide, XmasCardData } from './card-type';
import { popupImage, popupMouseMove } from '../actions/app';
import { store } from '../store';

import './popup-image';

@customElement('xmas-card')
export class XmasCard extends connect(store)(LitElement) {
  @property({ type: Object })
  public xmasCardData!: XmasCardData;

  @property({ type: String })
  private year = '2023';

  @property({ type: String })
  private side: CardSide = 'front';

  protected render() {
    if (this.xmasCardData !== undefined)
      return html`
        <map id="imageMap" name="imageMap">
          ${this.xmasCardData![this.side].cardData.map(
            (item: CardItem, index: number) => this.addArea(item, index)
          )}
        </map>
        <img
          src="${this.xmasCardData.images}/${this.xmasCardData[this.side]
            .cardGrid.i}"
          alt="${this.xmasCardData[this.side].cardGrid.t}"
          usemap="#imageMap"
        />
      `;
    return html``;
  }

  addArea(entry: CardItem, index: number): TemplateResult {
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
      width = xPos + factorX * entry.w;
      height = yPos + factorY * entry.h;
    }
    return html`<area
      shape="rect"
      index=${index}
      @mouseenter=${this._ShowImage}
      @mouseleave=${this._HideImage}
      @mousemove=${this._moveMouse}
      coords="${xPos},${yPos},${width},${height}"
      href="#${this.year}#image#${this.side}#${index}"
    />`;
  }

  _ShowImage(event: MouseEvent) {
    const target = event.target as any;
    const index = Number(target.getAttribute('index'));

    if (this.xmasCardData !== undefined) {
      const currentImage = `${this.xmasCardData.images}/${
        this.xmasCardData[this.side].cardGrid.s
      }${this.xmasCardData[this.side].cardData[index].i}.png`;
      const currentText = this.xmasCardData[this.side].cardData[index].t;

      store.dispatch(popupImage(currentImage, currentText));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private _moveMouse(event: MouseEvent) {
    store.dispatch(popupMouseMove(event.pageX, event.pageY));
  }

  // eslint-disable-next-line class-methods-use-this
  private _HideImage(_event: MouseEvent) {
    store.dispatch(popupImage('', ''));
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

        img {
          max-width: 99vw;
          max-height: calc(100vh - 64px);
        }
      `,
    ];
  }
}
