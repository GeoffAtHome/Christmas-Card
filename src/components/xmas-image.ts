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
import { connect } from 'pwa-helpers';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { CardSide, XmasCardData } from './card-type';
import { wrapIndex } from './carousel-carousel';
import './snack-bar';
import { store, RootState } from '../store';

@customElement('xmas-image')
export class XmasImage extends connect(store)(LitElement) {
  @property({ type: Object })
  public xmasCardData!: XmasCardData;

  @property({ type: String })
  private year = '';

  @property({ type: String })
  private side: CardSide = 'front';

  @property({ type: Boolean })
  private _snackbarOpened = false;

  @property({ type: Number })
  private index = 0;

  mainTemplate() {
    return html`
      <carousel-carousel .slideIndex=${this.index}
        >${this.images()}</carousel-carousel
      >

      <snack-bar ?active="${this._snackbarOpened}">
        ${this.xmasCardData !== undefined
          ? this.xmasCardData[this.side].cardData[this.index].t
          : ''}
      </snack-bar>
    `;
  }

  private images() {
    const imageList = this.xmasCardData![this.side].cardData;
    return imageList.map(
      image => html`
        <section>
          <a href="#${this.year}#card#${this.side}">
            <img
              src="${this.xmasCardData!.images}/${this.xmasCardData![this.side]
                .cardGrid.l}${image.i}.png"
              alt="${this.xmasCardData![this.side].cardData[this.index].t}"
              loading="lazy"
            />
          </a>
        </section>
      `
    );
  }

  stateChanged(state: RootState) {
    this.xmasCardData = state.app!.xmasCardData;
    this.year = state.app!.year;
    this.side = state.app!.side;
    this.index = wrapIndex(
      state.app!.index,
      this.xmasCardData![this.side].cardData.length
    );
    this._snackbarOpened = state.app!.snackbarOpened;
  }

  protected render() {
    return html`${this.mainTemplate()}`;
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
          height: 100vh;
          max-height: 100%;
          max-width: 100%;
        }

        img {
          max-width: 99vw;
          max-height: 99vh;
        }

        #left-button {
          display: none;
          position: fixed;
          top: 50%;
          left: 10%;
          box-shadow: var(
            --carousel-box-shadow,
            #293198 0.2em 0.2em 0.4em,
            #ceffff -0.1em -0.1em 0.2em
          );
        }

        #right-button {
          display: none;
          position: fixed;
          top: 50%;
          right: 10%;
          box-shadow: var(
            --carousel-box-shadow,
            #293198 0.2em 0.2em 0.4em,
            #ceffff -0.1em -0.1em 0.2em
          );
        }

        #right-button[active],
        #left-button[active] {
          display: block;
        }
      `,
    ];
  }
}
