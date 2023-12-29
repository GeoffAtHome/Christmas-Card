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

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { PageViewElement } from './page-view-element';
import { RootState, store } from '../store';

@customElement('popup-image')
export class PopupImage extends connect(store)(PageViewElement) {
  @property({ type: String })
  private image = '';

  @property({ type: String })
  private text = '';

  @property({ type: Number })
  xPos = 0;

  @property({ type: Number })
  yPos = 0;

  protected render() {
    return html`
      <img
        src="${this.image}"
        alt="${this.text}"
        width="280px"
        loading="eager"
      />
      <p>${this.text}</p>
    `;
  }

  stateChanged(state: RootState) {
    this.style.top = `${Math.max(
      100,
      state.app!.yPos - this.clientHeight * 0.5
    )}px`;
    this.style.left = `${state.app!.xPos + 5}px`;
    this.image = state.app!.currentImage;
    this.text = state.app!.currentTitle;
    this.active = this.image !== '';
    this.style.display = this.image === '' ? 'none' : 'block';
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: none;
          display: block;
          position: absolute;
          padding: 10px;
          width: 300px;
          font-size: 12px;
          background-color: white;
        }
      `,
    ];
  }
}
