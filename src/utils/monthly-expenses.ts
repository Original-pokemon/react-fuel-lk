import { TransactionType } from '#root/types';
import {
  MonthlyExpensesData,
  MonthlyExpenseSummary,
  CardMonthlyExpense,
  FuelExpense,
} from '#root/types/monthly-expenses';

/**
 * Агрегирует транзакции по месяцам, картам и видам топлива
 * Формирует все месяцы в заданном диапазоне дат
 */
function aggregateMonthlyExpenses(
  transactions: TransactionType[],
  nomenclature: { fuelid: number; fuelname: string }[] = [],
  startDate?: Date,
  endDate?: Date,
  availabilityDay: number = 5,
): MonthlyExpensesData {
  const fuelMap = new Map(nomenclature.map((n) => [n.fuelid, n.fuelname]));

  // Определяем диапазон дат
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 6); // 6 месяцев назад
  const effectiveStartDate = startDate || defaultStartDate;
  const effectiveEndDate = endDate || new Date();

  // Генерируем все месяцы в диапазоне, исключая текущий месяц
  const monthsInRange: string[] = [];
  const current = new Date(
    effectiveStartDate.getFullYear(),
    effectiveStartDate.getMonth(),
    1,
  );
  const end = new Date(
    effectiveEndDate.getFullYear(),
    effectiveEndDate.getMonth(),
    1,
  );
  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  while (current <= end) {
    const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    // Исключаем текущий месяц
    if (monthKey !== currentMonthKey) {
      monthsInRange.push(monthKey);
    }
    current.setMonth(current.getMonth() + 1);
  }

  // Фильтруем месяцы по дате доступности
  const availableMonths = monthsInRange.filter((monthKey) => {
    const [year, month] = monthKey.split('-').map(Number);
    // Дата доступности: availabilityDay число следующего месяца
    const monthAvailabilityDate = new Date(year, month, availabilityDay);
    return currentDate >= monthAvailabilityDate;
  });

  // Группируем транзакции по месяцам
  const monthMap = new Map<string, Map<number, Map<number, FuelExpense>>>();

  transactions.forEach((transaction) => {
    // Только списания (op === -1)
    if (transaction.op !== -1) return;

    const transactionDate = new Date(transaction.dt);
    const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;

    // Проверяем, что транзакция в диапазоне
    if (!availableMonths.includes(monthKey)) return;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, new Map());
    }

    const cardMap = monthMap.get(monthKey)!;

    if (!cardMap.has(transaction.cardnum)) {
      cardMap.set(transaction.cardnum, new Map());
    }

    const fuelMapForCard = cardMap.get(transaction.cardnum)!;

    if (!fuelMapForCard.has(transaction.fuelid)) {
      fuelMapForCard.set(transaction.fuelid, {
        fuelId: transaction.fuelid,
        fuelName:
          fuelMap.get(transaction.fuelid) || `Топливо ${transaction.fuelid}`,
        volume: 0,
        amount: 0,
      });
    }

    const fuelExpense = fuelMapForCard.get(transaction.fuelid)!;
    fuelExpense.volume += transaction.volume;
    fuelExpense.amount += Math.abs(transaction.summa);
  });

  // Преобразуем в итоговую структуру
  const months: MonthlyExpenseSummary[] = [];
  let totalVolume = 0;
  let totalAmount = 0;

  // Обрабатываем все месяцы в диапазоне (включая пустые)
  availableMonths.reverse().forEach((monthKey) => {
    const monthCardMap = monthMap.get(monthKey) || new Map();
    const cards: CardMonthlyExpense[] = [];
    const fuelTotalsMap = new Map<number, FuelExpense>();

    // Обрабатываем каждую карту
    monthCardMap.forEach((fuelMapForCard, cardNumber) => {
      const fuelExpenses: FuelExpense[] = [...fuelMapForCard.values()];
      const cardTotalVolume = fuelExpenses.reduce(
        (sum, fuel) => sum + fuel.volume,
        0,
      );
      const cardTotalAmount = fuelExpenses.reduce(
        (sum, fuel) => sum + fuel.amount,
        0,
      );

      cards.push({
        cardNumber,
        cardOwner: `Карта ${cardNumber}`, // В данных нет имени владельца
        fuelExpenses,
        totalVolume: cardTotalVolume,
        totalAmount: cardTotalAmount,
      });

      // Добавляем к итогам по топливу
      fuelExpenses.forEach((fuel) => {
        if (!fuelTotalsMap.has(fuel.fuelId)) {
          fuelTotalsMap.set(fuel.fuelId, {
            fuelId: fuel.fuelId,
            fuelName: fuel.fuelName,
            volume: 0,
            amount: 0,
          });
        }
        const totalFuel = fuelTotalsMap.get(fuel.fuelId)!;
        totalFuel.volume += fuel.volume;
        totalFuel.amount += fuel.amount;
      });
    });

    const fuelTotals = [...fuelTotalsMap.values()];
    const monthTotalVolume = fuelTotals.reduce(
      (sum, fuel) => sum + fuel.volume,
      0,
    );
    const monthTotalAmount = fuelTotals.reduce(
      (sum, fuel) => sum + fuel.amount,
      0,
    );

    // Получаем название месяца
    const [year, month] = monthKey.split('-');
    const monthNames = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
    const monthName = `${monthNames[Number.parseInt(month, 10) - 1]} ${year}`;

    months.push({
      month: monthKey,
      monthName,
      cards,
      fuelTotals,
      totalVolume: monthTotalVolume,
      totalAmount: monthTotalAmount,
    });

    totalVolume += monthTotalVolume;
    totalAmount += monthTotalAmount;
  });

  return {
    months,
    totalVolume,
    totalAmount,
  };
}

export default aggregateMonthlyExpenses;
