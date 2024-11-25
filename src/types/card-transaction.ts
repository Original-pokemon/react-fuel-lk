enum OperationType {
  Debit = -1,
  Credit = 1,
}

export type TransactionType = {
  confirmed: 0 | 1; // Статус подтверждения
  dt: string; // Дата и время транзакции
  firmid: number; // ID фирмы
  cardnum: number; // Номер карты
  op: OperationType; // Операция (-1 для списания, 1 для пополнения)
  fuelid: number; // ID топлива
  price: number; // Цена за единицу
  volume: number; // Объем топлива
  summa: number; // Сумма транзакции
  azs: number; // ID АЗС
};
