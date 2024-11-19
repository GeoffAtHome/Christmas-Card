/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, TemplateResult, PropertyValueMap } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property, query } from 'lit/decorators.js';
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
import { popupImage, popupMouseMove, resizeImage } from '../actions/app';
import { RootState, store } from '../store';

import './popup-image';
import { imageLoaded } from './data-image';

function getContainedSize(img: HTMLImageElement) {
  const ratio = img.naturalWidth / img.naturalHeight;
  let width = img.height * ratio;
  let { height } = img;
  if (width > img.width) {
    width = img.width;
    height = img.width / ratio;
  }
  return [width, height];
}

@customElement('xmas-card')
export class XmasCard extends connect(store)(LitElement) {
  @query('#image')
  private image: any;

  @property({ type: Object })
  public xmasCardData!: XmasCardData;

  @property({ type: String })
  private year = '2024';

  @property({ type: String })
  private side: CardSide = 'front';

  @property({ type: Number })
  private scaleWidth = 1.0;

  @property({ type: Number })
  private scaleHeight = 1.0;

  @property({ type: Number })
  private offsetW = 0;

  @property({ type: Number })
  private offsetH = 0;

  @property({ type: Array })
  private imageSize: Array<number> = [];

  private resizeObserver = new ResizeObserver(this._resize);

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.resizeObserver.observe(this.image);
  }

  protected render() {
    if (this.xmasCardData !== undefined)
      return html`
        <img
          id="image"
          style="display:block; width:${this.xmasCardData[this.side].cardGrid
            .m}px;height:${this.xmasCardData[this.side].cardGrid.n}px;"
          large="${this.xmasCardData.images}/${this.side}/${destLarge}.webp"
          src="data:image/webp;base64,${this.xmasCardData[this.side].cardGrid
            .d}"
          alt="${this.xmasCardData[this.side].cardGrid.t}"
          usemap="#imageMap"
          @load=${imageLoaded}
        />
        <map id="imageMap" name="imageMap">
          ${this.xmasCardData![this.side].cardData.map(
            (item: CardItem, index: number) =>
              this.addArea(item, index, this.scaleWidth, this.scaleHeight)
          )}
        </map>
      `;
    return html``;
  }

  addArea(
    entry: CardItem,
    index: number,
    scaleWidth: number,
    scaleHeight: number
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

    return html`<area
      shape="rect"
      index=${index}
      @mouseenter=${this._ShowImage}
      @mouseleave=${this._HideImage}
      @mousemove=${this._moveMouse}
      coords="${this.offsetW + xPos * scaleWidth},${this.offsetH +
      yPos * scaleHeight},${this.offsetW + width * scaleWidth},${this.offsetH +
      height * scaleHeight}"
      href="#${this.year}#image#${this.side}#${index}"
    />`;
  }

  stateChanged(state: RootState) {
    this.xmasCardData = state.app!.xmasCardData;
    this.year = state.app!.year;
    this.side = state.app!.side;
    if (this.image !== null) {
      const [width, height] = getContainedSize(this.image);
      this.offsetW = (state.app!.scaleWidth - width) / 2;
      this.offsetH = (state.app!.scaleHeight - height) / 2;
      this.scaleWidth = width / this.xmasCardData![this.side].cardGrid.m;
      this.scaleHeight = height / this.xmasCardData![this.side].cardGrid.n;
    }
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
    store.dispatch(popupImage('', '', '', 0, 0));
  }

  // eslint-disable-next-line class-methods-use-this
  private _resize(resize: Array<ResizeObserverEntry>) {
    const { width, height } = resize[0].contentRect;
    store.dispatch(resizeImage(width, height));
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
