/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { property, customElement, query } from 'lit/decorators.js';

import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  fileLoad,
} from '../actions/app';

// These are the elements needed by this element.
// import { Card2023 } from '../../2023/xmas-2023';

import '@pwabuilder/pwainstall';
import '@pwabuilder/pwaupdate';
import './xmas-main';
import { CardSide, XmasCardData } from './card-type';

function _BackButtonClicked() {
  window.history.back();
}

@customElement('main-app')
export class MainApp extends connect(store)(LitElement) {
  @query('#track')
  private track: any;

  @property({ type: String })
  private _page = 'card';

  @property({ type: String })
  private _year = '2023';

  @property({ type: Object })
  private _xMasCardData!: XmasCardData;

  @property({ type: Number })
  private _index = 0;

  @property({ type: String })
  private _side: CardSide = 'front';

  private startX: number = 0;

  private startY: number = 0;

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        .parent {
          display: grid;
          grid-template-rows: 1fr auto;
        }

        .content {
          display: grid;
          grid-template-columns: minmax(0px, 0%) 1fr;
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
          margin-top: 0px;
          margin-bottom: 0px;
          padding: 0px;
        }
      `,
    ];
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <xmas-main
        .xmasCard=${this._xMasCardData}
        ._year=${this._year}
        ._page=${this._page}
        ._side=${this._side}
        ._index=${this._index}
      ></xmas-main>
      <pwa-install></pwa-install>
      <pwa-update offlineToastDuration="0" swpath="sw.js"></pwa-update>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  protected firstUpdated() {
    installRouter(location =>
      store.dispatch(navigate(decodeURIComponent(location.href)))
    );
    installOfflineWatcher(offline => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`, () =>
      store.dispatch(updateDrawerState(false))
    );
    // this.track.addEventListener('touchstart', this.handleStart, false);
    // this.track.addEventListener('touchend', this.handleEnd, false);
  }

  stateChanged(state: RootState) {
    this._index = state.app!.index;
    this._side = state.app!.side;
    this._page = state.app!.page;
    if (this._year !== state.app!.year) {
      this._year = state.app!.year;
      store.dispatch(fileLoad(this._year));
    }
    this._xMasCardData = state.app!.xmasCardData;
  }

  handleStart(e: TouchEvent) {
    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;

    return true;
  }

  handleEnd(e: TouchEvent) {
    const deltaX = e.changedTouches[0].pageX - this.startX;
    const deltaY = Math.abs(e.changedTouches[0].pageY - this.startY);
    if (deltaX > 100 && deltaY < 100) {
      window.history.back();
    } else if (deltaX < -100 && deltaY < 100) {
      window.history.forward();
    }
  }
}
