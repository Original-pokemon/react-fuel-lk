export type FuelType = {
  fuelid: number;
  volume: number;
};

export type CardType = {
  dt: string; // Дата и время операции
  firmid: number; // Идентификатор фирмы
  cardnum: number; // Номер карты
  cardowner: string; // Владелец карты
  blocked: boolean; // Заблокирована ли карта
  wallettype: number; // Тип кошелька
  monthlimit: number; // Месячный лимит
  monthremain: number; // Оставшийся месячный лимит
  daylimit: number; // Дневной лимит
  dayremain: number; // Оставшийся дневной лимит
  datedaylimit: string; // Дата дневного лимита
  datelastop: string; // Дата последней операции
  fuels: FuelType[]; // Список топлив
};
