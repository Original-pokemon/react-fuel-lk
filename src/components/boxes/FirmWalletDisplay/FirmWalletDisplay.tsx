import { useEffect } from 'react';
import { FuelWalletType } from '#root/types';
import { useAppStore } from '#root/store';
import { useApi } from '#root/hooks';
import { Status } from '#root/const';
import Spinner from '#root/components/Spinner/Spinner';
import InfoBox from '../InfoBox/InfoBox';

function FirmWalletDisplay({ fuelWallet }: { fuelWallet: FuelWalletType[] }) {
  const api = useApi();
  const { nomenclature, status, fetchNomenclatureData } = useAppStore();
  const isIdle = status === Status.Idle;

  useEffect(() => {
    if (!nomenclature && isIdle) {
      fetchNomenclatureData(api);
    }
  }, [nomenclature, isIdle, fetchNomenclatureData, api]);

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
