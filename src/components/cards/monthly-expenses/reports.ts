import dayjs from 'dayjs';
import { TransactionType } from '#root/types';

type NomenclatureItem = {
  fuelid: number;
  fuelname: string;
};

export type FuelSummary = {
  fuelId: number;
  fuelName: string;
  totalVolume: number;
  avgAzsPrice: number;
  avgPrice: number;
  totalSum: number;
  transactionCount: number;
};

export type CardFuelReport = {
  id: string;
  cardNumber: number;
  cardOwner: string;
  fuels: FuelSummary[];
  totalSum: number;
  totalVolume: number;
  transactionCount: number;
};

export type FuelReportRow = {
  id: string;
  hierarchy: string[];
  cardNumber: number;
  cardOwner?: string;
  fuelId?: number;
  fuelName?: string;
  totalVolume: number;
  avgAzsPrice: number;
  avgPrice: number;
  totalSum: number;
  transactionCount: number;
};

type FuelTotal = { volume: number; amount: number };

function getFuelName(fuelId: number, nomenclature: NomenclatureItem[]): string {
  const item = nomenclature.find((n) => n.fuelid === fuelId);
  return item ? item.fuelname : `Топливо ${fuelId}`;
}

function groupTransactionsByCard(
  transactions: TransactionType[],
): Map<number, TransactionType[]> {
  const cardMap = new Map<number, TransactionType[]>();

  transactions.forEach((transaction) => {
    const cardNum = transaction.cardnum;
    if (!cardMap.has(cardNum)) {
      cardMap.set(cardNum, []);
    }
    cardMap.get(cardNum)!.push(transaction);
  });

  return cardMap;
}

function generateCardLines(
  cardMap: Map<number, TransactionType[]>,
  nomenclature: NomenclatureItem[],
): string[] {
  const lines: string[] = [];

  cardMap.forEach((cardTransactions, cardNumber) => {
    // Calculate card totals
    const cardVolume = cardTransactions.reduce((sum, t) => sum + t.volume, 0);
    const cardAmount = cardTransactions.reduce(
      (sum, t) => sum + Math.abs(t.summa),
      0,
    );

    // Add card total line
    const cardTotalLine = `${cardNumber};;;;;;${cardVolume.toFixed(2)};;;${cardAmount.toFixed(2)}`;
    lines.push(cardTotalLine);

    // Group transactions by fuel
    const fuelMap = new Map<number, TransactionType[]>();
    cardTransactions.forEach((transaction) => {
      const fuelId = transaction.fuelid;
      if (!fuelMap.has(fuelId)) {
        fuelMap.set(fuelId, []);
      }
      fuelMap.get(fuelId)!.push(transaction);
    });

    fuelMap.forEach((fuelTransactions, fuelId) => {
      // Calculate fuel totals
      const fuelVolume = fuelTransactions.reduce((sum, t) => sum + t.volume, 0);
      const fuelAmount = fuelTransactions.reduce(
        (sum, t) => sum + Math.abs(t.summa),
        0,
      );

      // Add fuel total line
      const fuelName = getFuelName(fuelId, nomenclature);
      const fuelTotalLine = `${fuelName};;;;;;${fuelVolume.toFixed(2)};;;${fuelAmount.toFixed(2)}`;
      lines.push(fuelTotalLine);

      // Sort transactions by date
      fuelTransactions.sort((a, b) => a.dt.localeCompare(b.dt));

      // Output each transaction
      fuelTransactions.forEach((transaction) => {
        // Format date to DD.MM.YYYY HH:mm:ss
        const formattedDateTime = dayjs(transaction.dt).format(
          'DD.MM.YYYY HH:mm:ss',
        );
        const line = `;${formattedDateTime};АЗС ${transaction.azs};;${cardNumber}; ;${transaction.volume.toFixed(2)};${transaction.price.toFixed(2)};${transaction.price.toFixed(2)};${Math.abs(transaction.summa).toFixed(2)}`;
        lines.push(line);
      });
    });
  });

  return lines;
}

function aggregateOverallFuelTotals(
  transactions: TransactionType[],
): Map<number, FuelTotal> {
  const overallFuelTotals = new Map<number, FuelTotal>();

  transactions.forEach((transaction) => {
    const fuelId = transaction.fuelid;
    if (!overallFuelTotals.has(fuelId)) {
      overallFuelTotals.set(fuelId, { volume: 0, amount: 0 });
    }
    const total = overallFuelTotals.get(fuelId)!;
    total.volume += transaction.volume;
    total.amount += Math.abs(transaction.summa);
  });

  return overallFuelTotals;
}

function generateOverallFuelLines(
  overallFuelTotals: Map<number, FuelTotal>,
): string[] {
  const lines: string[] = ['Итог:;Количество;;Сумма', ''];

  overallFuelTotals.forEach((total, fuelId) => {
    lines.push(
      `${fuelId};${total.volume.toFixed(2)};;${total.amount.toFixed(2)}`,
    );
  });

  return lines;
}

// Функция генерации детального отчета из реальных транзакций
export function generateDetailedFuelReportFromTransactions(
  transactions: TransactionType[],
  startDate: string,
  endDate: string,
  firmName: string,
  nomenclature: NomenclatureItem[] = [],
): string {
  const lines: string[] = [];

  // Заголовок отчета
  lines.push(
    `Расход по чиповым картам с ${startDate.split('-').reverse().join('.')} по ${endDate.split('-').reverse().join('.')} ${firmName}`,
    '',
    '',
    'День /Номенклатура;Дата время;АЗС;Адрес;Карта;Держатель;Количество;Цена на АЗС;Цена;Сумма',
  );

  // Calculate totals
  const totalVolume = transactions.reduce((sum, t) => sum + t.volume, 0);
  const totalAmount = transactions.reduce(
    (sum, t) => sum + Math.abs(t.summa),
    0,
  );

  // Add total line right after header
  const totalLine = `Итог;;;;;;${totalVolume.toFixed(2)};;;${totalAmount.toFixed(2)}`;
  lines.push(totalLine);

  const cardMap = groupTransactionsByCard(transactions);
  lines.push(...generateCardLines(cardMap, nomenclature));

  const overallFuelTotals = aggregateOverallFuelTotals(transactions);
  lines.push(...generateOverallFuelLines(overallFuelTotals));

  return lines.join('\n');
}
