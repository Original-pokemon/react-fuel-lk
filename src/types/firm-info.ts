import type { CardType } from './card';

export type FuelWalletType = {
  fuelid: number;
  remain: number;
};

export type FirmCashType = {
  conf: number; // Подтвержденный баланс
  unconf: number | null; // Неподтвержденный баланс
  remain: number; // Оставшийся баланс
  unconfV: number | null; // Неподтвержденный объем
};

export type FirmInfoType = {
  firmid: number; // Идентификатор фирмы
  firmname: string; // Название фирмы
  firmcash: FirmCashType; // Кассовый баланс фирмы
  firmwallet: FuelWalletType[]; // Кошелек фирмы по топливам
  cards: CardType[]; // Список карт фирмы
};
