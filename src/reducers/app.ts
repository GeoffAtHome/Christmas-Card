/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';

import {
  UPDATE_PAGE,
  UPDATE_OFFLINE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  UPDATE_DRAWER_STATE,
  NOTIFY_MESSAGE,
  POPUP_IMAGE,
  POPUP_MOUSEMOVE,
  FILE_LOAD_FULFILLED,
  SWITCH_SIDE,
  UPDATE_INDEX,
  RESIZE_IMAGE,
} from '../actions/app';
import { RootAction } from '../store';
import { CardSide, Pages, XmasCardData } from '../components/card-type';

export interface AppState {
  year: string;
  page: Pages;
  offline: boolean;
  message: string;
  drawerOpened: boolean;
  snackbarOpened: boolean;
  title: string;
  side: CardSide;
  index: number;
  xPos: number;
  yPos: number;
  scaleWidth: number;
  scaleHeight: number;
  currentImage: string;
  currentImageData: string;
  currentImageWidth: number;
  currentImageHeight: number;
  currentTitle: string;
  xmasCardData: XmasCardData;
}

const INITIAL_STATE: AppState = {
  year: '',
  page: 'card',
  offline: false,
  message: '',
  drawerOpened: false,
  snackbarOpened: false,
  title: '',
  side: 'front',
  index: -1,
  xPos: 0,
  yPos: 0,
  scaleWidth: 1.0,
  scaleHeight: 1.0,
  currentImage: '',
  currentImageData: '',
  currentImageWidth: 0,
  currentImageHeight: 0,
  currentTitle: '',
  xmasCardData: undefined,
};

// eslint-disable-next-line default-param-last
const app: Reducer<AppState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        year: action.year,
        page: action.page,
        side: action.side,
        index: action.index,
      };

    case FILE_LOAD_FULFILLED:
      if (!action.payload)
        return {
          ...state,
        };
      return {
        ...state,
        xmasCardData: action.payload,
      };

    case RESIZE_IMAGE:
      return {
        ...state,
        scaleWidth: action.width,
        scaleHeight: action.height,
      };

    case POPUP_IMAGE:
      return {
        ...state,
        currentImage: action.image,
        currentImageData: action.data,
        currentImageWidth: action.width,
        currentImageHeight: action.height,
        currentTitle: action.title,
      };

    case POPUP_MOUSEMOVE:
      return {
        ...state,
        xPos: action.xPos,
        yPos: action.yPos,
      };

    case SWITCH_SIDE:
      return {
        ...state,
        side: action.side,
      };

    case UPDATE_INDEX:
      return {
        ...state,
        index: action.index,
      };

    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline,
      };

    case NOTIFY_MESSAGE:
      return {
        ...state,
        message: action.message,
      };

    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened,
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true,
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false,
      };
    default:
      return state;
  }
};

export default app;
