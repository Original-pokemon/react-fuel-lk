import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { AsyncThunkConfig } from '#root/types/thunk-config';
import { NameSpace } from '#root/const';
import { dropToken, saveToken } from '#root/services/api/token';
import type { AuthInfoType } from '#root/types';
import { APIRoute } from '../../api-route';

export type AuthorizationDataType = {
  role: string;
  firmid: number[];
  cardnum: number[];
};

const authorizationDataToAuthInfo = (
  authData: AuthorizationDataType,
): AuthInfoType => {
  return {
    isAdmin: authData.role === 'Admin',
    isFirm: authData.firmid.length > 0,
    isCard: authData.cardnum.length > 0,
    firmId: authData.firmid.length > 0 ? authData.firmid[0] : 0,
    cardNum: authData.cardnum.length > 0 ? authData.cardnum[0] : 0,
  };
};

export const postAuthData = createAsyncThunk<
  AuthInfoType,
  { username: string; password: string; rememberMe: boolean },
  AsyncThunkConfig
>(
  `${NameSpace.Auth}/postAuthData`,
  async ({ username, password, rememberMe }, { extra: api }) => {
    try {
      const { data } = await api.post<
        AuthorizationDataType & { token: string }
      >(APIRoute.Token, { username, password });
      // const data = await generateMockAuthorizationData(5000)
      const { token, ...authData } = data;

      saveToken(token, rememberMe);

      return authorizationDataToAuthInfo(authData);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        const toastId = 'auth-error';
        dropToken();

        if (!toast.isActive(toastId)) {
          toast.warn('Неверные имя пользователя или пароль.', { toastId });
        }
      }

      throw error;
    }
  },
);

export const fetchAuthInfo = createAsyncThunk<
  AuthInfoType,
  undefined,
  AsyncThunkConfig
>(`${NameSpace.Auth}/getAuthInfo`, async (_argument, { extra: api }) => {
  try {
    const { data } = await api.get<AuthInfoType>(APIRoute.AuthInfo);

    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      const toastId = 'get-auth-error';
      dropToken();
      if (!toast.isActive(toastId)) {
        toast.warn('Пожалуйста, войдите в систему заново.', { toastId });
      }
    }

    throw error;
  }
});
