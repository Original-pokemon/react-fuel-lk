import { createAction } from '@reduxjs/toolkit';
import { NameSpace } from '../const/store';

export const setCards = createAction(`${NameSpace.Card}/getCards`);
export const fetchCurrentLocation = createAction(
  `${NameSpace.App}/fetchCurrentLocation`,
);
