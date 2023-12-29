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
// eslint-disable-next-line import/extensions
import { customElement, query } from 'lit/decorators.js';

import Swiper, { Navigation, Pagination } from 'swiper';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('swiper-carousel')
export class SwiperCarousel extends LitElement {
  @query('.swiper')
  private swiperElement: any;

  private swiper: any = {};

  protected render() {
    return html`
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
          ...
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>

        <!-- If we need scrollbar -->
        <div class="swiper-scrollbar"></div>
      </div>
    `;
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
          padding: 10px;
        }
        .swiper {
          width: 600px;
          height: 300px;
        }
      `,
    ];
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.swiper = new Swiper(this.swiperElement, {
      // Optional parameters
      direction: 'vertical',
      loop: true,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
