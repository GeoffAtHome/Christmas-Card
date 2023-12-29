import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import { xmasMain } from '../src/components/xmas-main';
import '../src/components/xmas-main.js';

describe('HgMirror', () => {
  let element: xmasMain;
  beforeEach(async () => {
    element = await fixture(html`<xmas-main></xmas-main>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
