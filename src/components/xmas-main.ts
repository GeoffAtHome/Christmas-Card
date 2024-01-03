import { LitElement, html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { property, customElement } from 'lit/decorators.js';

import { store } from '../store';
import { showSnackbar } from '../actions/app';
import { CardSide, XmasCardData } from './card-type';

@customElement('xmas-main')
export class xmasMain extends LitElement {
  @property({ type: String })
  private _year = '';

  @property({ type: String })
  private _page = '';

  @property({ type: String })
  private _side: CardSide = 'front';

  @property({ type: Number })
  private _index = 0;

  @property({ type: Object })
  xmasCard!: XmasCardData;

  static styles = css`
    :host {
      display: grid;
      place-items: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--hg-mirror-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5v min);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  render() {
    if (this._page === 'image')
      return html` <xmas-image
        .xmasCardData=${this.xmasCard}
        .year=${this._year}
        .index=${Number(this._index)}
        .side=${this._side}
        @mousemove=${this.mouseMove}
        @keypress=${this.keyPress}
      ></xmas-image>`;

    if (this.xmasCard !== undefined)
      return html` <popup-image></popup-image>
        <xmas-card
          .xmasCardData=${this.xmasCard}
          side=${this._side}
          .year=${this._year}
        ></xmas-card>`;

    return html``;
  }

  // eslint-disable-next-line class-methods-use-this
  private mouseMove(_mouse: MouseEvent) {
    store.dispatch(showSnackbar());
  }

  // eslint-disable-next-line class-methods-use-this
  private keyPress(key: KeyboardEvent) {
    console.log(key.key);
  }
}
