import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home/Home';
import Transactions from './pages/Transactions/Transactions';
import Cards from './pages/Cards/Cards';
import Contracts from './pages/Contracts/Contracts';
import Login from './pages/Login/Login';
import AzsMap from './pages/AzsMap/AzsMap';
import AuthGuard from './components/AuthGuard/AuthGuard';
import {
  useAuthStore,
  useAppStore,
  useApiResponseStore,
  useFirmStore,
} from './store';
import { Status } from './const';
import Layout from './components/layouts/Layout';
import 'react-toastify/dist/ReactToastify.css';
import AppRoute from './const/app-route';

function App() {
  const { authData, status: authStatus } = useAuthStore();
  const { fetchNomenclatureData } = useAppStore();
  const { fetchApiResponseData } = useApiResponseStore();
  const { fetchFirmData } = useFirmStore();

  const isAuthSuccess = authStatus === Status.Success;

  useEffect(() => {
    if (isAuthSuccess && authData?.firmId) {
      fetchApiResponseData(authData.firmId);
      fetchFirmData(authData.firmId);
      fetchNomenclatureData();
    }
  }, [
    isAuthSuccess,
    authData?.firmId,
    fetchApiResponseData,
    fetchFirmData,
    fetchNomenclatureData,
  ]);

  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Routes>
        <Route path={AppRoute.Login} element={<Login />} />
        <Route element={<AuthGuard />}>
          <Route path={AppRoute.Main} element={<Layout />}>
            <Route index element={<Home />} />
            {/* <Route path={AppRoute.Profile} element={<Profile />} /> */}
            <Route path={AppRoute.Transaction} element={<Transactions />} />
            <Route path={AppRoute.Cards} element={<Cards />} />
            <Route path={AppRoute.Contracts} element={<Contracts />} />
            <Route path={AppRoute.Card} element={<Cards />} />
            <Route path={AppRoute.AzsMap} element={<AzsMap />} />
            {/* <Route
        path={AppRoute.PageNotFound}
        element={<NotFoundPage />}
        /> */}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
