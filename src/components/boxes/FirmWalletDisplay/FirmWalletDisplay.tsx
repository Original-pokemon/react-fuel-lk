import { useEffect } from "react";
import { FuelWalletType } from "#root/types";
import { useAppStore } from "#root/store";
import { Status } from "#root/const";
import Spinner from "#root/components/Spinner/Spinner";
import InfoBox from "../InfoBox/InfoBox";

function FirmWalletDisplay({ fuelWallet }: { fuelWallet: FuelWalletType[] }) {
  const { nomenclature, status, fetchNomenclatureData } = useAppStore();
  const isIdle = status === Status.Idle;

  useEffect(() => {
    if (!nomenclature && isIdle) {
      fetchNomenclatureData();
    }
  }, [nomenclature, isIdle, fetchNomenclatureData]);

  if (!nomenclature) {
    return <Spinner />;
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
      : [{ "Нет топлива": "" }];

  return <InfoBox title="Баланс топлива" data={dataToShow} />;
}

export default FirmWalletDisplay;
