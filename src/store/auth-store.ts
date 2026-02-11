import { create } from 'zustand';
import { toast } from 'react-toastify';
import { AxiosError, AxiosInstance } from 'axios';
import type { AuthInfoType, StatusType } from '#root/types';
import { Status } from '#root/const';
import { dropToken, saveToken } from '#root/services/api/token';
import { APIRoute } from './api-route';

type AuthorizationDataType = {
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

interface AuthState {
  status: StatusType;
  authData?: AuthInfoType;
  postAuthData: (
    credentials: { username: string; password: string; rememberMe: boolean },
    api: AxiosInstance,
  ) => Promise<void>;
  fetchAuthInfo: (api: AxiosInstance) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: Status.Idle,
  authData: undefined,

  postAuthData: async ({ username, password, rememberMe }, api) => {
    set({ status: Status.Loading });
    try {
      const { data } = await api.post<
        AuthorizationDataType & { token: string }
      >(APIRoute.Token, { username, password });
      const { token, ...authData } = data;

      saveToken(token, rememberMe);

      set({
        status: Status.Success,
        authData: authorizationDataToAuthInfo(authData),
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        const toastId = 'auth-error';
        dropToken();

        if (!toast.isActive(toastId)) {
          toast.warn('Неверные имя пользователя или пароль.', { toastId });
        }
      }

      set({ status: Status.Error });
      throw error;
    }
  },

  fetchAuthInfo: async (api) => {
    set({ status: Status.Loading });
    try {
      const { data } = await api.get<AuthInfoType>(APIRoute.AuthInfo);

      set({
        status: Status.Success,
        authData: data,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        const toastId = 'get-auth-error';
        dropToken();
        if (!toast.isActive(toastId)) {
          toast.warn('Пожалуйста, войдите в систему заново.', { toastId });
        }
      }

      set({ status: Status.Error });
      throw error;
    }
  },

  logout: () => {
    dropToken();
    set({
      authData: undefined,
      status: Status.Idle,
    });
  },
}));
