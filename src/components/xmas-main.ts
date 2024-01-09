import { LitElement, html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { property, customElement } from 'lit/decorators.js';

import { store } from '../store';
import { popupImage, showSnackbar } from '../actions/app';
import { CardSide, Pages, XmasCardData } from './card-type';

@customElement('xmas-main')
export class xmasMain extends LitElement {
  @property({ type: String })
  private _page: Pages = 'card';

  @property({ type: Object })
  xmasCardData: XmasCardData;

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
      min-height: calc(100vh - 64px);
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
    switch (this._page) {
      case 'image':
        store.dispatch(popupImage('', ''));
        return html` <xmas-image></xmas-image>`;

      case 'large':
        return html`<popup-image inert role="tooltip"></popup-image>
          <xmas-large-image></xmas-large-image>`;

      default:
        break;
    }
    return html` <popup-image></popup-image>
      <xmas-card></xmas-card>`;
  }
}
