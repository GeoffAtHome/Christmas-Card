/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css, LitElement, PropertyValueMap } from 'lit';
import { connect } from 'pwa-helpers';
import { register } from 'swiper/element/bundle';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

import { CardSide, XmasCardData, destLarge } from './card-type';
import { store, RootState } from '../store';

function wrapIndex(idx: number, max: number): number {
  return ((idx % max) + max) % max;
}

@customElement('xmas-image')
export class XmasImage extends connect(store)(LitElement) {
  @property({ type: Object })
  public xmasCardData!: XmasCardData;

  @property({ type: String })
  private year = '';

  @property({ type: String })
  private side: CardSide = 'front';

  @property({ type: Number })
  private index = 0;

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    // register Swiper custom elements
    register();
  }

  mainTemplate() {
    return html`
      <swiper-container
        .initialSlide=${this.index}
        slides-per-view="auto"
        centered-slides
        effect="cube"
        keyboard
        navigation
        pagination
        pagination-clickable
        loop
        pagination-type="bullets"
        speed="1200"
      >
        ${this.images()}
      </swiper-container>
    `;
  }

  //  <img
  //  style="display:block; width:${this.xmasCardData!.images}/${this
  //    .side}/${destLarge}/${this.xmasCardData![this.side].cardData[
  //    index
  //  ].w}px ;height:${this.xmasCardData!.images}/${this
  //    .side}/${destLarge}/${this.xmasCardData![this.side].cardData[
  //    index
  //  ].h}px;"
  //  src="data:image/webp;base64,${this.xmasCardData!.images}/${this
  //    .side}/${destLarge}/${this.xmasCardData![this.side].cardData[
  //    index
  //  ].d}"
  //  large="${this.xmasCardData!.images}/${this
  //    .side}/${destLarge}/${this.xmasCardData![this.side].cardData[
  //    index
  //  ].i}.webp"
  //

  private images() {
    const imageList = this.xmasCardData![this.side].cardData;
    return imageList.map(
      (image, index) => html`
        <swiper-slide>
          <a href="#${this.year}#large#${this.side}#${index}">
            <img
              style="display:block; width:${this.xmasCardData![this.side]
                .cardData[index].m}px ;height:${this.xmasCardData![this.side]
                .cardData[index].n}px;"
              src="data:image/webp;base64,${this.xmasCardData![this.side]
                .cardData[index].d}"
              large="${this.xmasCardData!.images}/${this
                .side}/${destLarge}/${this.xmasCardData![this.side].cardData[
                index
              ].i}.webp"
              alt="${image.t}"
              loading="lazy"
              @load=${this.imageLoaded}
            />
            <p>${image.t}</p>
          </a>
        </swiper-slide>
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
  }

  // eslint-disable-next-line class-methods-use-this
  imageLoaded(e: any /* HTMLImageElement */) {
    const large = e.target.getAttribute('large');
    if (large !== '') {
      e.target.src = large;
      e.target.setAttribute('large', '');
    }
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
          overflow: hidden;
        }

        swiper-container {
          width: 99vw;
          height: 99vh;
          text-align: center;
          color: blue;
        }

        swiper-slide img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          -ms-transform: translate(-50%, -50%);
          -webkit-transform: translate(-50%, -50%);
          -moz-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          position: absolute;
          left: 50%;
          top: 50%;
        }

        p {
          position: absolute;
          text-align: center;
          bottom: 0px;
          transform: translate(-50%, -50%);
          left: 50%;
          width: 500px;
          color: white;
          background-color: gray;
          opacity: 0.6;
          max-width: 60vh;
        }
      `,
    ];
  }
}
