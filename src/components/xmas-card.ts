/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, TemplateResult, PropertyValueMap } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, query, state } from 'lit/decorators.js';
import { connect } from 'pwa-helpers';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { CardItem, CardData } from './card-type';
import { PageViewElement } from './page-view-element';
import { popupImage, popupMouseMove } from '../actions/app';
import { store } from '../store';

@customElement('xmas-card')
export class XmasCard extends connect(store)(PageViewElement) {
  @property({ type: Object })
  private cardData!: CardData;

  @property({ type: String })
  private side: 'front' | 'back' = 'front';

  protected render() {
    return html`
      <p>${this.cardData.cardGrid.title}</p>
      <map id="imageMap" name="imageMap">
        ${this.cardData.cardData.map((item, index) =>
          this.addArea(item, index)
        )}
      </map>
      <div>
        <img
          src="src/images/${this.cardData.cardGrid.image}"
          alt="${this.cardData.cardGrid.title}"
          width="${this.cardData.cardGrid.width}"
          height="${this.cardData.cardGrid.height}"
          usemap="#imageMap"
        />
      </div>
    `;
  }

  addArea(entry: CardItem, index: number): TemplateResult {
    let xPos = entry.posX;
    let yPos = entry.posY;
    let width = xPos + entry.width;
    let height = yPos + entry.height;

    if (entry.posX < this.cardData.cardGrid.xGrid) {
      const factorX =
        this.cardData.cardGrid.width / this.cardData.cardGrid.xGrid;
      const factorY =
        this.cardData.cardGrid.height / this.cardData.cardGrid.yGrid;
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
      href="./#image#${this.side}#${index}"
    />`;
  }

  _ShowImage(event: MouseEvent) {
    const target = event.target as any;
    const index = Number(target.getAttribute('index'));

    const currentImage = `src/images/${this.cardData.cardGrid.smallImagePrefix}${this.cardData.cardData[index].imageNumber}.png`;
    const currentText = this.cardData.cardData[index].title;

    store.dispatch(popupImage(currentImage, currentText));
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
          display: none;
          text-align: center;
          width: 100%;
          height: auto;
        }

        :host([active]) {
          display: inline;
        }

        p {
          text-align: center;
        }
      `,
    ];
  }
}
