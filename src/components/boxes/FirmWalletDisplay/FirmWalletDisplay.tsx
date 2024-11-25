import { useEffect } from 'react';
import { FuelWalletType } from '#root/types';
import { useAppDispatch, useAppSelector } from '#root/hooks/state';
import {
  getAppStatus,
  getNomenclatureInfo,
  fetchNomenclatureData,
} from '#root/store';
import Spinner from '#root/components/Spinner/Spinner';
import InfoBox from '../InfoBox/InfoBox';

function FirmWalletDisplay({ fuelWallet }: { fuelWallet: FuelWalletType[] }) {
  const dispatch = useAppDispatch();
  const nomenclature = useAppSelector(getNomenclatureInfo);
  const { isIdle } = useAppSelector(getAppStatus);

  useEffect(() => {
    if (!nomenclature && isIdle) {
      dispatch(fetchNomenclatureData());
    }
  }, [nomenclature, dispatch, isIdle]);

  if (!nomenclature) {
    return <Spinner fullscreen={false} />;
  }

  const walletData = fuelWallet.map((wallet) => {
    const fuelNomenclature = nomenclature.find(
      (nom) => nom.fuelid === wallet.fuelid,
    );

    return {
      [`${fuelNomenclature ? fuelNomenclature.fuelname : 'Неизвестное топливо'}`]: `${wallet.remain} литров`,
    };
  });

  return <InfoBox title="Баланс топлива" data={walletData} />;
}

export default FirmWalletDisplay;
