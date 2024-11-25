/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { CardType, FirmInfoType, StatusType } from '#root/types';
import { NameSpace, Status } from '#root/const';
import { fetchFirmData } from './thunk';

type InitialStateType = {
  status: StatusType;
  firmInfo?: Omit<FirmInfoType, 'cards'>;
};

const cardsAdapter = createEntityAdapter<CardType & { id: number }, number>({
  selectId: (card) => card.id,
  sortComparer: (a, b) => a.id - b.id,
});

const initialState: InitialStateType = {
  status: Status.Idle,
  firmInfo: undefined,
};

const firmDataSlice = createSlice({
  name: NameSpace.Auth,
  initialState: {
    ...initialState,
    cards: cardsAdapter.getInitialState(),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFirmData.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchFirmData.fulfilled, (state, { payload: firmData }) => {
        const { cards, ...firmInfo } = firmData;

        state.status = Status.Success;
        state.firmInfo = firmInfo;
        state.cards = cardsAdapter.setAll(
          state.cards,
          cards.map((card) => ({ ...card, id: card.cardnum })),
        );
      })
      .addCase(fetchFirmData.rejected, (state) => {
        state.status = Status.Error;
      });
  },
});

export { cardsAdapter, firmDataSlice };
