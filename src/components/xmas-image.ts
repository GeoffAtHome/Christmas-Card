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
import { consume } from '@lit/context';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { CardSide } from './card-type';
import { xmasCardContext, XmasCardData } from './carddata-context';
import './carousel-carousel';
import './snack-bar';
import {
  BOOTSTRAP_CHEVRON_LEFT,
  BOOTSTRAP_CHEVRON_RIGHT,
} from './carousel-constants';
import { store, RootState } from '../store';
import { showSnackbar } from '../actions/app';

@customElement('xmas-image')
export class XmasImage extends connect(store)(LitElement) {
  @consume({ context: xmasCardContext })
  @property({ type: Object })
  public xmasCardData!: XmasCardData;

  @property({ type: String })
  private year = '';

  @property({ type: String })
  private side: CardSide = 'front';

  @property({ type: Number })
  private index = 0;

  @property({ type: Boolean })
  private _snackbarOpened = false;

  mainTemplate() {
    if (this.xmasCardData[this.side].cardData[this.index] !== undefined)
      return html`
        <slide-button
          id="left-button"
          @click=${this.navigateToPrevSlide}
          ?active="${this._snackbarOpened && this.index !== 0}"
        >
          ${BOOTSTRAP_CHEVRON_LEFT}
        </slide-button>
        <slide-button
          id="right-button"
          @click=${this.navigateToNextSlide}
          ?active="${this._snackbarOpened &&
          this.index < this.xmasCardData[this.side].cardData.length - 1}"
        >
          ${BOOTSTRAP_CHEVRON_RIGHT}
        </slide-button>
        <a href="#${this.year}#card">
          <img
            src="${this.xmasCardData.images}/${this.xmasCardData[this.side]
              .cardGrid.largeImagePrefix}${this.xmasCardData[this.side]
              .cardData[this.index].imageNumber}.png"
            alt="${this.xmasCardData[this.side].cardData[this.index].title}"
          />
        </a>
        <snack-bar ?active="${this._snackbarOpened}">
          ${this.xmasCardData[this.side].cardData[this.index].title}
        </snack-bar>
      `;
    return html` <a href="#${this.year}#card"><p>Image not found</p></a>`;
  }

  stateChanged(state: RootState) {
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
          display: grid;
          place-items: center;
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

  navigateToNextSlide() {
    // Animation driven by the `updated` lifecycle.
    if (this.index + 1 < this.xmasCardData[this.side].cardData.length)
      this.index += 1;

    store.dispatch(showSnackbar());
  }

  navigateToPrevSlide() {
    // Animation driven by the `updated` lifecycle.
    if (this.index > 0) this.index -= 1;
    store.dispatch(showSnackbar());
  }
}
