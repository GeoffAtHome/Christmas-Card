import { LitElement, html, css, PropertyValueMap } from 'lit';
import { provide } from '@lit/context';

// eslint-disable-next-line import/extensions
import { property, customElement } from 'lit/decorators.js';

import { xmasCardContext, XmasCardData } from './carddata-context';
import { store } from '../store';
import { showSnackbar } from '../actions/app';

// These are the elements needed by this element.
import { Card2023 } from '../../2023/xmas-2023';

@customElement('xmas-main')
export class xmasMain extends LitElement {
  @property({ type: String })
  private _year = '';

  @property({ type: String })
  private _page = '';

  @property({ type: String })
  private _side = '';

  @property({ type: Number })
  private _index = 0;

  @provide({ context: xmasCardContext })
  @property({ type: Object })
  xmasCard: XmasCardData = Card2023;

  static styles = css`
    :host {
      min-height: 100vh;
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
        .year=${this._year}
        .index=${Number(this._index)}
        .side=${this._side}
        @mousemove=${this.mouseMove}
        @keypress=${this.keyPress}
      ></xmas-image>`;

    return html` <popup-image></popup-image>
      <xmas-card
        side="front"
        style="width: ${this.xmasCard.front.cardGrid.width}px"
      ></xmas-card>
      <xmas-card
        side="back"
        style="width: ${this.xmasCard.back.cardGrid.width}px"
      ></xmas-card>`;
  }

  // eslint-disable-next-line class-methods-use-this
  mouseMove(_mouse: MouseEvent) {
    store.dispatch(showSnackbar());
  }

  // eslint-disable-next-line class-methods-use-this
  keyPress(key: KeyboardEvent) {
    console.log(key.key);
  }
}
