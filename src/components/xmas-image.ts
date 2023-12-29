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
import { consume } from '@lit/context';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { CardSide } from './card-type';
import { xmasCardContext, XmasCardData } from './carddata-context';

@customElement('xmas-image')
export class XmasImage extends LitElement {
  @consume({ context: xmasCardContext })
  @property({ type: Object })
  public xmasCardData!: XmasCardData;

  @property({ type: String })
  private side: CardSide = 'front';

  @property({ type: Number })
  private index = 0;

  protected render() {
    if (this.xmasCardData[this.side].cardData[this.index] !== undefined)
      return html`
        <p>${this.xmasCardData[this.side].cardData[this.index].title}</p>
        <a href="#card">
          <img
            src="src/images/${this.xmasCardData[this.side].cardGrid
              .largeImagePrefix}${this.xmasCardData[this.side].cardData[
              this.index
            ].imageNumber}.png"
            alt="${this.xmasCardData[this.side].cardData[this.index].title}"
          />
        </a>
      `;
    return html` <a href="#card"><p>Image not found</p></a>`;
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
