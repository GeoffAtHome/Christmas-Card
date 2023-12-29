/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { CardData } from './card-type';
import { PageViewElement } from './page-view-element';

@customElement('xmas-image')
export class XmasImage extends PageViewElement {
  @property({ type: Object })
  private cardData!: CardData;

  @property({ type: Number })
  private index = 0;

  protected render() {
    return html`
      <p>${this.cardData.cardData[this.index].title}</p>
      <img
        src="src/images/${this.cardData.cardGrid.largeImagePrefix}${this
          .cardData.cardData[this.index].imageNumber}.png"
        alt="${this.cardData.cardData[this.index].title}"
      />
    `;
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
          display: block;
        }

        p {
          text-align: center;
        }
      `,
    ];
  }
}
