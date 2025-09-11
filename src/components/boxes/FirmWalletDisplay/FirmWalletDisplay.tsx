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

  // Фильтруем только те записи, у которых есть fuelname и remain > 0
  const filteredWalletData = fuelWallet
    .map((wallet) => {
      const fuelNomenclature = nomenclature.find(
        (nom) => nom.fuelid === wallet.fuelid,
      );
      if (fuelNomenclature && wallet.remain > 0) {
        return { [fuelNomenclature.fuelname]: `${wallet.remain} литров` };
      }
      return null;
    })
    .filter((item) => item !== null) as Record<string, string>[];

  // Если данных нет, показываем сообщение "Нет топлива"
  const dataToShow =
    filteredWalletData.length > 0
      ? filteredWalletData
      : [{ 'Нет топлива': '' }];

  return <InfoBox title="Баланс топлива" data={dataToShow} />;
}

export default FirmWalletDisplay;
