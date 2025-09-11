import { createAction } from '@reduxjs/toolkit';
import NameSpace from '../store/const';

export const setCards = createAction(`${NameSpace.Card}/getCards`);
export const fetchCurrentLocation = createAction(
  `${NameSpace.App}/fetchCurrentLocation`,
);
