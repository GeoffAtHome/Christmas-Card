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
import { consume } from '@lit/context';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import { connect } from 'pwa-helpers';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { CardItem, CardSide } from './card-type';
import { type XmasCardData, xmasCardContext } from './carddata-context';
import { popupImage, popupMouseMove } from '../actions/app';
import { store } from '../store';

import './popup-image';

@customElement('xmas-card')
export class XmasCard extends connect(store)(LitElement) {
  @consume({ context: xmasCardContext })
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
          ${this.xmasCardData[this.side].cardData.map((item, index) =>
            this.addArea(item, index)
          )}
        </map>
        <div>
          <img
            src="${this.xmasCardData.images}/${this.xmasCardData[this.side]
              .cardGrid.image}"
            alt="${this.xmasCardData[this.side].cardGrid.title}"
            width="${this.xmasCardData[this.side].cardGrid.width}"
            height="${this.xmasCardData[this.side].cardGrid.height}"
            usemap="#imageMap"
          />
        </div>
      `;
    return html``;
  }

  addArea(entry: CardItem, index: number): TemplateResult {
    let xPos = entry.posX;
    let yPos = entry.posY;
    let width = xPos + entry.width;
    let height = yPos + entry.height;

    if (entry.posX < this.xmasCardData![this.side].cardGrid.xGrid) {
      const factorX =
        this.xmasCardData![this.side].cardGrid.width /
        this.xmasCardData![this.side].cardGrid.xGrid;
      const factorY =
        this.xmasCardData![this.side].cardGrid.height /
        this.xmasCardData![this.side].cardGrid.yGrid;
      xPos = entry.posX * factorX;
      yPos = entry.posY * factorY;
      width = xPos + factorX * entry.width;
      height = yPos + factorY * entry.height;
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
        this.xmasCardData[this.side].cardGrid.smallImagePrefix
      }${this.xmasCardData[this.side].cardData[index].imageNumber}.png`;
      const currentText = this.xmasCardData[this.side].cardData[index].title;

      store.dispatch(popupImage(currentImage, currentText));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _moveMouse(event: MouseEvent) {
    store.dispatch(popupMouseMove(event.pageX, event.pageY));
  }

  // eslint-disable-next-line class-methods-use-this
  _HideImage(_event: MouseEvent) {
    store.dispatch(popupImage('', ''));
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
          text-align: center;
          width: 100%;
          height: auto;
        }

        p {
          text-align: center;
        }
      `,
    ];
  }
}
