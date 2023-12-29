/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { html } from 'lit';

export const BOOTSTRAP_CHEVRON_RIGHT = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  class="bi bi-chevron-right"
  viewBox="0 0 16 16"
>
  <path
    fill-rule="evenodd"
    stroke="currentColor"
    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
  />
</svg>`;
export const BOOTSTRAP_CHEVRON_LEFT = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  class="bi bi-chevron-left"
  viewBox="0 0 16 16"
>
  <path
    fill-rule="evenodd"
    stroke="currentColor"
    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
  />
</svg>`;

type CompositeOperationOrAuto = 'accumulate' | 'add' | 'auto' | 'replace';
type PlaybackDirection =
  | 'alternate'
  | 'alternate-reverse'
  | 'normal'
  | 'reverse';
type FillMode = 'auto' | 'backwards' | 'both' | 'forwards' | 'none';
type CompositeOperation = 'accumulate' | 'add' | 'replace';
type IterationCompositeOperation = 'accumulate' | 'replace';

interface EffectTiming {
  delay?: number;
  direction?: PlaybackDirection;
  duration?: number | string;
  easing?: string;
  endDelay?: number;
  fill?: FillMode;
  iterationStart?: number;
  iterations?: number;
  playbackRate?: number;
}

interface Keyframe {
  composite?: CompositeOperationOrAuto;
  easing?: string;
  offset?: number | null;
  [property: string]: string | number | null | undefined;
}

interface KeyframeEffectOptions extends EffectTiming {
  composite?: CompositeOperation;
  iterationComposite?: IterationCompositeOperation;
  pseudoElement?: string | null;
}

interface KeyframeAnimationOptions extends KeyframeEffectOptions {
  id?: string;
}

const SLIDE_OUT_BACK_LEFT: Keyframe[] = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-100vw)' },
];
const SLIDE_OUT_BACK_RIGHT: Keyframe[] = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(100vw)' },
];
const FORWARD_ANIMATION_OPTS: KeyframeAnimationOptions = {
  duration: 500,
  easing: 'ease-in-out',
  iterations: 1,
};
const REVERSE_ANIMATION_OPTS: KeyframeAnimationOptions = {
  ...FORWARD_ANIMATION_OPTS,
  direction: 'reverse',
};

export type AnimationTuple = [Keyframe[], KeyframeAnimationOptions];

export const SLIDE_LEFT_OUT: AnimationTuple = [
  SLIDE_OUT_BACK_LEFT,
  FORWARD_ANIMATION_OPTS,
];
export const SLIDE_RIGHT_OUT: AnimationTuple = [
  SLIDE_OUT_BACK_RIGHT,
  FORWARD_ANIMATION_OPTS,
];
export const SLIDE_LEFT_IN: AnimationTuple = [
  SLIDE_OUT_BACK_LEFT,
  REVERSE_ANIMATION_OPTS,
];
export const SLIDE_RIGHT_IN: AnimationTuple = [
  SLIDE_OUT_BACK_RIGHT,
  REVERSE_ANIMATION_OPTS,
];
