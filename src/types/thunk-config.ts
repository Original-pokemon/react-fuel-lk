import { AxiosInstance } from 'axios';
import type { AppDispatchType, StateType } from '.';
import { Status } from '../const';

export type AsyncThunkConfig = {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
};

export type StatusType = (typeof Status)[keyof typeof Status];
