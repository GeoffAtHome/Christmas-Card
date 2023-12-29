import { LitElement, html, css } from 'lit';
import { provide } from '@lit/context';

// eslint-disable-next-line import/extensions
import { property, customElement } from 'lit/decorators.js';

import { xmasCardContext, XmasCardData } from './carddata-context';

@customElement('xmas-main')
export class xmasMain extends LitElement {
  @property({ type: String })
  private _page = '';

  @property({ type: Number })
  private _index = 0;

  @provide({ context: xmasCardContext })
  @property({ type: Object })
  xmasCard!: XmasCardData;

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
      return html` <xmas-image .index=${this._index}></xmas-image>`;

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
}
