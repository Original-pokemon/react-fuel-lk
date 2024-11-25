import React from 'react';
import type { FirmCashType } from '#root/types';
import InfoBox from '../InfoBox/InfoBox';

const CONFIRMED_BALANCE_LABEL: string = 'Подтвержденный баланс';
const UNCONFIRMED_BALANCE_LABEL: string = 'Неподтвержденный баланс';
const REMAINING_BALANCE_LABEL: string = 'Оставшийся баланс';
const UNCONFIRMED_VOLUME_LABEL: string = 'Неподтвержденный объем';
const NO_DATA_LABEL: string = 'Нет данных';

const FirmCashDisplay: React.FC<{ firmCash: FirmCashType }> = ({
  firmCash,
}) => {
  const { conf, unconf, remain, unconfV } = firmCash;

  const confirmedBalance = conf ? `${conf} руб.` : NO_DATA_LABEL;
  const unconfirmedBalance = unconf ? `${unconf} руб.` : NO_DATA_LABEL;
  const remainingBalance = remain ? `${remain} руб.` : NO_DATA_LABEL;
  const unconfirmedVolume = unconfV ? `${unconfV} м³` : NO_DATA_LABEL;

  const cashData = [
    { [CONFIRMED_BALANCE_LABEL]: confirmedBalance },
    { [UNCONFIRMED_BALANCE_LABEL]: unconfirmedBalance },
    { [REMAINING_BALANCE_LABEL]: remainingBalance },
    { [UNCONFIRMED_VOLUME_LABEL]: unconfirmedVolume },
  ];

  return <InfoBox title="Баланс организации" data={cashData} />;
};

export default FirmCashDisplay;
