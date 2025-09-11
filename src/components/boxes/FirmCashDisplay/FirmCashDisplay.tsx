import React from 'react';
import type { FirmCashType } from '#root/types';
import InfoBox from '../InfoBox/InfoBox';

const CONFIRMED_BALANCE_LABEL: string = 'Баланс';
const DEBT_LABEL: string = 'Задолженность';
const NO_DATA_LABEL: string = 'Нет данных';

const FirmCashDisplay: React.FC<{ firmCash: FirmCashType }> = ({
  firmCash,
}) => {
  const { conf, unconf } = firmCash;

  const confirmedBalance = conf ? `${conf} руб.` : NO_DATA_LABEL;
  const debt = unconf ? `${unconf} руб.` : NO_DATA_LABEL; // Если нужно иное вычисление — изменить здесь

  const cashData = [
    { [CONFIRMED_BALANCE_LABEL]: confirmedBalance },
    { [DEBT_LABEL]: debt },
  ];

  return <InfoBox title="Баланс организации" data={cashData} />;
};

export default FirmCashDisplay;
