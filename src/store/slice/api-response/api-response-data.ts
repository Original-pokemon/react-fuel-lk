/* eslint-disable no-param-reassign */
import type {
  StatusType,
  ApiResponseType,
  FirmDataType,
  CardInfoType,
} from '#root/types';
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { NameSpace, Status } from '#root/const';
import { fetchApiResponseData } from './thunk';

const apiResponseCardsAdapter = createEntityAdapter<
  CardInfoType & { id: number },
  number
>({
  selectId: (card) => card.id,
  sortComparer: (a, b) => a.id - b.id,
});

type InitialStateType = {
  status: StatusType;
  fuelnames?: ApiResponseType['fuelNames'];
  pricetypes?: ApiResponseType['priceTypes'];
  firm?: FirmDataType;
  data?: ApiResponseType;
};

const initialState: InitialStateType = {
  status: Status.Idle,
  data: undefined,
  fuelnames: undefined,
  firm: undefined,
  pricetypes: undefined,
};

const apiResponseDataSlice = createSlice({
  name: NameSpace.ApiResponse,
  initialState: {
    ...initialState,
    cards: apiResponseCardsAdapter.getInitialState(),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiResponseData.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchApiResponseData.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.data = action.payload;
        state.fuelnames = action.payload.fuelNames;
        state.pricetypes = action.payload.priceTypes;
        state.firm = action.payload.firms.find(
          (f: FirmDataType) => f.firmId === action.meta.arg,
        );
        state.cards = apiResponseCardsAdapter.setAll(
          state.cards,
          Object.values(state.firm?.cards || {}).map((card) => ({
            ...card,
            id: card.cardNumber,
          })),
        );
      })
      .addCase(fetchApiResponseData.rejected, (state) => {
        state.status = Status.Error;
      });
  },
});

export { apiResponseCardsAdapter, apiResponseDataSlice };
