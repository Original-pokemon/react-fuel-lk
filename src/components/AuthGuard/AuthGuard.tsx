import { Outlet, useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { getToken } from '#root/services/api/token';
import { useAuthStore } from '#root/store';
import { useApi } from '#root/hooks';
import { Status } from '#root/const';
import AppRoute from '#root/const/app-route';
import Spinner from '../Spinner/Spinner';

function AuthGuard(): React.JSX.Element {
  const api = useApi();
  const navigate = useNavigate();
  const { status, fetchAuthInfo, logout } = useAuthStore();
  const token = getToken();

  const isIdle = status === Status.Idle;
  const isError = status === Status.Error;
  const isLoading = status === Status.Loading;

  useEffect(() => {
    if (isIdle && token) {
      fetchAuthInfo(api);
    }
  }, [isIdle, token, fetchAuthInfo, api]);

  useEffect(() => {
    if (isError || !token) {
      navigate(AppRoute.Login);
      logout();
    }
  }, [isError, token, navigate, logout]);

  if (isLoading) {
    return <Spinner fullscreen={false} size={100} />;
  }

  return <Outlet />;
}

export default AuthGuard;
