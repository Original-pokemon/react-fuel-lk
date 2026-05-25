import { Outlet, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { getToken } from "#root/services/api/token";
import { useAuthStore } from "#root/store";
import { Status } from "#root/const";
import AppRoute from "#root/const/app-route";
import Spinner from "../Spinner/Spinner";

function AuthGuard(): React.JSX.Element {
  const navigate = useNavigate();
  const { status, fetchAuthInfo, logout } = useAuthStore();
  const token = getToken();

  const isIdle = status === Status.Idle;
  const isSuccess = status === Status.Success;
  const isError = status === Status.Error;

  useEffect(() => {
    if (isIdle && token) {
      fetchAuthInfo();
    }
  }, [isIdle, token, fetchAuthInfo]);

  useEffect(() => {
    if (!token) {
      navigate(AppRoute.Login);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isError) {
      navigate(AppRoute.Login);
      logout();
    }
  }, [isError, navigate, logout]);

  if (isSuccess) {
    return <Outlet />;
  }

  return <Spinner fullscreen size={100} />;
}

export default AuthGuard;
