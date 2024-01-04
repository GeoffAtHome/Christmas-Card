/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css, PropertyValues } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
  // eslint-disable-next-line import/extensions
} from 'lit/decorators.js';

// eslint-disable-next-line import/extensions
import { styleMap } from 'lit/directives/style-map.js';
import {
  AnimationTuple,
  SLIDE_LEFT_IN,
  SLIDE_LEFT_OUT,
  SLIDE_RIGHT_IN,
  SLIDE_RIGHT_OUT,
  BOOTSTRAP_CHEVRON_LEFT,
  BOOTSTRAP_CHEVRON_RIGHT,
} from './carousel-constants';

import './carousel-button';
import { store } from '../store';
import { updateIndex, showSnackbar } from '../actions/app';

function hideSlide(el: HTMLElement) {
  el.classList.add('slide-hidden');
}

function showSlide(el: HTMLElement) {
  el.classList.remove('slide-hidden');
}
export function wrapIndex(idx: number, max: number): number {
  return ((idx % max) + max) % max;
}

@customElement('carousel-carousel')
export class CarouselCarousel extends LitElement {
  static override styles = css`
    ::slotted(.slide-hidden) {
      display: none;
    }

    /** So the elements all overlap */
    ::slotted(*) {
      position: absolute;
      padding: 1em;
    }

    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: center;
    }

    #container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      overflow: hidden;
      position: relative;
    }
  `;

  // Assume this is always a valid slide index.
  @property({ type: Number }) slideIndex = 0;

  @queryAssignedElements() private readonly slideElements!: HTMLElement[];

  /**
   * Return slide index in the range of [0, slideElement.length)
   */
  get wrappedIndex(): number {
    return wrapIndex(this.slideIndex, this.slideElements.length);
  }

  override render() {
    const containerStyles = {
      height: `100vh`,
      width: `90vw`,
    };

    return html`<slide-button
        part="buttons left-button"
        exportparts="internal-btn : buttons"
        @click=${this.navigateToPrevSlide}
      >
        ${BOOTSTRAP_CHEVRON_LEFT}
      </slide-button>

      <div part="container" id="container" style="${styleMap(containerStyles)}">
        <slot></slot>
      </div>

      <slide-button
        part="buttons right-button"
        exportparts="internal-btn : buttons"
        @click=${this.navigateToNextSlide}
      >
        ${BOOTSTRAP_CHEVRON_RIGHT}
      </slide-button>`;
  }

  override firstUpdated() {
    this.initializeSlides();
  }

  override updated(changedProperties: PropertyValues<this>): void {
    // Not covered in the video, but if you want to drive animations from the
    // 'slideIndex' attribute and property, we can calculate the animation in
    // the 'updated' lifecycle callback.
    if (changedProperties.has('slideIndex')) {
      const oldSlideIndex = changedProperties.get('slideIndex');
      if (oldSlideIndex === undefined) {
        return;
      }
      const isAdvancing = this.slideIndex > oldSlideIndex;

      if (isAdvancing) {
        // Animate forwards
        this.navigateWithAnimation(1, SLIDE_LEFT_OUT, SLIDE_RIGHT_IN);
      } else {
        // Animate backwards
        this.navigateWithAnimation(-1, SLIDE_RIGHT_OUT, SLIDE_LEFT_IN);
      }
    }
  }

  navigateToNextSlide() {
    // Animation driven by the `updated` lifecycle.
    store.dispatch(updateIndex(this.slideIndex + 1));
    store.dispatch(showSnackbar());
  }

  navigateToPrevSlide() {
    // Animation driven by the `updated` lifecycle.
    store.dispatch(updateIndex(this.slideIndex - 1));
    store.dispatch(showSnackbar());
  }

  private async navigateWithAnimation(
    nextSlideOffset: number,
    leavingAnimation: AnimationTuple,
    enteringAnimation: AnimationTuple
  ) {
    this.initializeSlides();
    const leavingElIndex = wrapIndex(
      this.slideIndex - nextSlideOffset,
      this.slideElements.length
    );
    const elLeaving = this.slideElements[leavingElIndex];
    showSlide(elLeaving);

    // Animate out current element
    const leavingAnim = elLeaving.animate(
      leavingAnimation[0],
      leavingAnimation[1]
    );

    // Entering slide
    const newSlideEl = this.slideElements[this.wrappedIndex];

    // Show the new slide
    showSlide(newSlideEl);

    // Teleport it out of view and animate it in
    const enteringAnim = newSlideEl.animate(
      enteringAnimation[0],
      enteringAnimation[1]
    );

    try {
      // Wait for animations
      await Promise.all([leavingAnim.finished, enteringAnim.finished]);

      // Hide the element that left
      hideSlide(elLeaving);
    } catch {
      /* Animation was cancelled */
    }
  }

  private initializeSlides() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.slideElements.length; i++) {
      const slide = this.slideElements[i];
      slide.getAnimations().forEach(anim => anim.cancel());
      if (i === this.wrappedIndex) {
        showSlide(slide);
      } else {
        hideSlide(slide);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'carousel-carousel': CarouselCarousel;
  }
}
