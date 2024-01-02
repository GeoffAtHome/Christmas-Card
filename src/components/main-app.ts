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
import '@material/mwc-top-app-bar';
import '@material/mwc-drawer';
import '@material/mwc-button';
import '@pwabuilder/pwainstall';
import '@pwabuilder/pwaupdate';
import './xmas-main';
import { CardSide, XmasCardData } from './card-type';
import { arrowBackIcon, menuIcon, plusIcon } from './my-icons';

function _BackButtonClicked() {
  window.history.back();
}

@customElement('main-app')
export class MainApp extends connect(store)(LitElement) {
  @query('#track')
  private track: any;

  @property({ type: Boolean })
  private _drawerOpened = false;

  @property({ type: String })
  private _page = 'card';

  @property({ type: String })
  private _year = '';

  @property({ type: Object })
  private _xMasCardData!: XmasCardData; //  | undefined;

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

        mwc-drawer[open] mwc-top-app-bar {
          --mdc-top-app-bar-width: calc(100% - var(--mdc-drawer-width));
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

        .toolbar-list > a {
          display: grid;
          grid-template-rows: auto;
          text-decoration: none;
          font-size: 22px;
          font-weight: bold;
          padding: 8px;
        }

        .toolbar-list > a[selected] {
          background-color: #7413dc23;
        }

        .toolbar-list > a:hover {
          background-color: #7413dc0c;
        }
        .menu-btn,
        .btn {
          background: none;
          border: none;
          fill: white;
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
          margin-top: 0px;
          margin-bottom: 0px;
          padding: 0px;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        .img-menu {
          display: block;
          max-width: 200px;
          max-height: 20px;
          width: auto;
          height: auto;
        }
      `,
    ];
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <mwc-drawer hasHeader type="dismissible" .open="${this._drawerOpened}">
        <span slot="title">Menu</span>
        <div>
          <nav class="toolbar-list">
            <a ?selected="${this._year === '2023'}" href="/#2023#card">2023</a>
            <a ?selected="${this._year === '2022'}" href="/#2022#card">2022</a>
          </nav>
        </div>
        <!-- Header -->
        <div slot="appContent">
          <mwc-top-app-bar centerTitle>
            <div slot="title">
              ${this._xMasCardData !== undefined
                ? this._xMasCardData[this._side].cardGrid.title
                : 'Loading...'}
            </div>
            <mwc-button
              title="Menu"
              class="btn"
              slot="navigationIcon"
              @click="${this._menuButtonClicked}"
              >${menuIcon}</mwc-button
            >
            <div slot="actionItems"></div>
            ${this.getSidesButton()}
            <mwc-button
              class="btn"
              title="Back"
              slot="actionItems"
              @click="${_BackButtonClicked}"
              >${arrowBackIcon}</mwc-button
            >
          </mwc-top-app-bar>
          <div>
            <main id="track" role="main">
              <xmas-main
                .xmasCard=${this._xMasCardData}
                ._year=${this._year}
                ._page=${this._page}
                ._side=${this._side}
                ._index=${this._index}
              ></xmas-main>
            </main>
          </div>
        </div>
      </mwc-drawer>

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
    if (state.app!.year !== '' && this._year !== state.app!.year) {
      this._year = state.app!.year;
      store.dispatch(fileLoad(this._year));
    }
    this._year = state.app!.year;
    this._xMasCardData = state.app!.xmasCardData;
    this._drawerOpened = state.app!.drawerOpened;
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

  _SidesButtonClicked() {
    if (this._side === 'front') this._side = 'back';
    else this._side = 'front';
  }

  private _menuButtonClicked() {
    store.dispatch(updateDrawerState(!this._drawerOpened));
  }

  private getSidesButton() {
    if (this._page === 'card')
      return html` <mwc-button
        class="btn"
        title="Sides"
        slot="actionItems"
        @click="${this._SidesButtonClicked}"
        >${plusIcon}</mwc-button
      >`;

    return html``;
  }
}
