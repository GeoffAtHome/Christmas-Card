/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable import/extensions */
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createAsyncAction } from 'redux-promise-middleware-actions';
import { RootState, store } from '../store';
import { CardSide, Pages, XmasCardData } from '../components/card-type';
import { readFile } from '../components/myUtils';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const POPUP_IMAGE = 'POPUP_IMAGE';
export const POPUP_MOUSEMOVE = 'POPUP_MOUSEMOVE';
export const SWITCH_SIDE = 'SWITCH_SIDE';
export const UPDATE_INDEX = 'UPDATE_INDEX';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const FILE_LOAD = 'FILE_LOAD';
export const FILE_LOAD_FULFILLED = 'FILE_LOAD_FULFILLED';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const NOTIFY_MESSAGE = 'NOTIFY_MESSAGE';
export interface AppActionUpdatePage extends Action<'UPDATE_PAGE'> {
  year: string;
  page: Pages;
  side: CardSide;
  index: number;
}
export interface AppActionFileLoad extends Action<'FILE_LOAD'> {
  year: string;
}

export interface AppActionFileLoadFulfilled
  extends Action<'FILE_LOAD_FULFILLED'> {
  payload: XmasCardData;
}

export interface AppActionUpdateOffline extends Action<'UPDATE_OFFLINE'> {
  offline: boolean;
}
export interface AppActionPopupImage extends Action<'POPUP_IMAGE'> {
  image: string;
  title: string;
}

export interface AppActionPopupMouseMove extends Action<'POPUP_MOUSEMOVE'> {
  xPos: number;
  yPos: number;
}

export interface AppActionSwitchSide extends Action<'SWITCH_SIDE'> {
  side: CardSide;
}

export interface AppActionUpdateIndex extends Action<'UPDATE_INDEX'> {
  index: number;
}

export interface AppActionUpdateDrawerState
  extends Action<'UPDATE_DRAWER_STATE'> {
  opened: boolean;
}
export interface AppActionOpenSnackbar extends Action<'OPEN_SNACKBAR'> {}
export interface AppActionCloseSnackbar extends Action<'CLOSE_SNACKBAR'> {}
export interface AppActionNotifyMessages extends Action<'NOTIFY_MESSAGE'> {
  message: string;
}
export type AppAction =
  | AppActionUpdatePage
  | AppActionFileLoad
  | AppActionFileLoadFulfilled
  | AppActionPopupImage
  | AppActionPopupMouseMove
  | AppActionSwitchSide
  | AppActionUpdateIndex
  | AppActionUpdateOffline
  | AppActionUpdateDrawerState
  | AppActionOpenSnackbar
  | AppActionCloseSnackbar
  | AppActionNotifyMessages;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

const updatePage: ActionCreator<AppActionUpdatePage> = (
  year: string,
  page: Pages,
  side: CardSide,
  index: number
) => ({
  type: UPDATE_PAGE,
  year,
  page,
  side,
  index,
});

let xmasData: XmasCardData;

const fileLoadFulfilled: ActionCreator<
  AppActionFileLoadFulfilled
> = payload => ({ type: FILE_LOAD_FULFILLED, payload });

export const fileLoad = createAsyncAction('FILE_LOAD', async year => {
  xmasData = (await readFile(year)) as XmasCardData;
  store.dispatch(fileLoadFulfilled(xmasData));
  return {
    year,
  };
});

export const popupImage: ActionCreator<AppActionPopupImage> = (
  image: string,
  title: string
) => ({
  type: POPUP_IMAGE,
  image,
  title,
});

export const popupMouseMove: ActionCreator<AppActionPopupMouseMove> = (
  xPos: number,
  yPos: number
) => ({
  type: POPUP_MOUSEMOVE,
  xPos,
  yPos,
});

export const switchSide: ActionCreator<AppActionSwitchSide> = (
  side: CardSide
) => ({
  type: SWITCH_SIDE,
  side,
});

export const updateIndex: ActionCreator<AppActionUpdateIndex> = (
  index: number
) => ({
  type: UPDATE_INDEX,
  index,
});

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (
  opened: boolean
) => ({
  type: UPDATE_DRAWER_STATE,
  opened,
});

const loadPage: ActionCreator<ThunkResult> =
  (year: string, page: Pages, side: string, index: number) => dispatch => {
    switch (page) {
      case 'card':
        import('../components/xmas-card').then(() => {
          // Put code in here that you want to run every time when
          // navigating to view1 after my-view1 is loaded.
        });
        break;

      case 'image':
        import('../components/xmas-image');
        break;

      case 'large':
        import('../components/xmas-large-image');
        break;

      default:
        // eslint-disable-next-line no-param-reassign
        page = 'view404';
        import('../components/my-view404');
    }

    dispatch(updatePage(year, page, side, index));
  };

export const navigate: ActionCreator<ThunkResult> =
  (path: string) => dispatch => {
    const parts = path.split('#');
    const year = parts.length <= 1 ? '2023' : parts[1];
    const page: Pages = parts.length <= 2 ? 'card' : (parts[2] as Pages);
    const side: CardSide = parts.length <= 3 ? 'front' : (parts[3] as CardSide);
    const index = parts.length <= 4 ? -1 : Number(parts[4]);

    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(year, page, side, index));

    // Close the drawer - in case the *path* change came from a link in the drawer.
    if (window.matchMedia('(max-width: 700px)').matches) {
      dispatch(updateDrawerState(false));
    }
  };

let snackbarTimer: number;

export const showSnackbar: ActionCreator<ThunkResult> = () => dispatch => {
  dispatch({
    type: OPEN_SNACKBAR,
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(
    () => dispatch({ type: CLOSE_SNACKBAR }),
    3000
  );
};

export const notifyMessage: ActionCreator<ThunkResult> =
  (message: string) => dispatch => {
    dispatch(showSnackbar());
    dispatch({
      type: NOTIFY_MESSAGE,
      message,
    });
  };

export const updateOffline: ActionCreator<ThunkResult> =
  (offline: boolean) => (dispatch, getState) => {
    // Show the snackbar only if offline status changes.
    if (offline !== getState().app!.offline) {
      dispatch(showSnackbar());
    }
    const message: string = `You are now ${offline ? 'offline' : 'online'}`;

    dispatch({
      type: NOTIFY_MESSAGE,
      message,
    });
  };
