import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { CardType, TransactionType } from '#root/types';
import DashboardCard from '../DashboardCard/DashboardCard';
import KPIBox from '../KPIBox/KPIBox';
import ChartBox from '../ChartBox/ChartBox';
import DataListTable from '../DataListBox/DataListBox';

dayjs.extend(isBetween);

type TransactionsKpiCardProperties = {
  transactions: TransactionType[];
  periodDays?: number; // например, 7 по умолчанию
};

export function TransactionsKpiCard({
  transactions,
  periodDays = 7,
}: TransactionsKpiCardProperties) {
  // Фильтруем транзакции за последние `periodDays` дней
  const end = dayjs();
  const start = end.subtract(periodDays, 'day');

  const periodTransactions = transactions.filter((tx) =>
    dayjs(tx.dt).isBetween(start, end),
  );

  const totalTransactions = periodTransactions.length;
  // Предположим, что расход - это все транзакции с op = OperationType.Debit (списания)
  const debitTransactions = periodTransactions.filter((tx) => tx.op === -1);
  const totalVolume = debitTransactions.reduce((sum, tx) => sum + tx.volume, 0);
  const totalSpent = debitTransactions.reduce((sum, tx) => sum + tx.summa, 0);

  const daysInPeriod = periodDays;
  const averageDaily =
    daysInPeriod > 0 ? (totalVolume / daysInPeriod).toFixed(2) : 0;

  return (
    <DashboardCard title="Ключевые метрики">
      <KPIBox label="Транзакций за неделю" value={totalTransactions} />
      <KPIBox label="Средний расход в день" value={`${averageDaily} л`} />
      <KPIBox label="Потрачено всего" value={`${totalSpent.toFixed(2)} руб.`} />
    </DashboardCard>
  );
}

type FuelUsageChartCardProperties = {
  transactions: TransactionType[];
  nomenclature: { fuelid: number; fuelname: string }[];
  periodDays?: number;
};

export function FuelUsageChartCard({
  transactions,
  nomenclature,
  periodDays = 7,
}: FuelUsageChartCardProperties) {
  const end = dayjs();
  const start = end.subtract(periodDays, 'day');

  const periodTransactions = transactions.filter(
    (tx) => dayjs(tx.dt).isBetween(start, end) && tx.op === -1,
  );

  // Суммируем объемы по fuelid
  const volumeByFuel: Record<number, number> = {};
  for (const tx of periodTransactions) {
    volumeByFuel[tx.fuelid] = (volumeByFuel[tx.fuelid] || 0) + tx.volume;
  }

  // Преобразуем в массив для диаграммы
  const chartData = Object.entries(volumeByFuel).map(([fid, vol]) => {
    const fuelInfo = nomenclature.find((n) => n.fuelid === Number(fid));
    return {
      name: fuelInfo ? fuelInfo.fuelname : 'Неизвестно',
      value: vol,
    };
  });

  return (
    <DashboardCard title="Использование топлива">
      <ChartBox data={chartData} chartType="pie" />
    </DashboardCard>
  );
}

type ExpenseDynamicsChartCardProperties = {
  transactions: TransactionType[];
  periodDays?: number;
};

export function ExpenseDynamicsChartCard({
  transactions,
  periodDays = 30,
}: ExpenseDynamicsChartCardProperties) {
  const end = dayjs();
  const start = end.subtract(periodDays, 'day');

  const dailyExpenses: Record<string, number> = {};

  // Initialize daily expenses for the last `periodDays`
  for (let index = 0; index < periodDays; index++) {
    const date = dayjs(start).add(index, 'day').format('DD.MM');
    dailyExpenses[date] = 0;
  }

  const periodTransactions = transactions.filter(
    (tx) => dayjs(tx.dt).isBetween(start, end) && tx.op === -1,
  );

  for (const tx of periodTransactions) {
    const date = dayjs(tx.dt).format('DD.MM');
    dailyExpenses[date] = (dailyExpenses[date] || 0) + tx.summa;
  }

  const chartData = Object.entries(dailyExpenses)
    .sort(([dateA], [dateB]) => {
      const [dayA, monthA] = dateA.split('.').map(Number);
      const [dayB, monthB] = dateB.split('.').map(Number);
      return (
        dayjs()
          .month(monthA - 1)
          .date(dayA)
          .valueOf() -
        dayjs()
          .month(monthB - 1)
          .date(dayB)
          .valueOf()
      );
    })
    .map(([date, value]) => ({
      name: date,
      value,
    }));

  return (
    <DashboardCard title="Динамика расходов за 30 дней">
      <ChartBox data={chartData} />
    </DashboardCard>
  );
}

type OrganizationBalanceCardProperties = {
  confirmedBalance: number;
  debt?: number | null;
};

export function OrganizationBalanceCard({
  confirmedBalance,
  debt,
}: OrganizationBalanceCardProperties) {
  return (
    <DashboardCard title="Баланс организации">
      <KPIBox label="Баланс" value={`${confirmedBalance.toFixed(2)} руб.`} />
      <KPIBox
        label="Задолженность"
        value={debt ? `${debt.toFixed(2)} руб.` : 'Нет данных'}
      />
    </DashboardCard>
  );
}

type CardsInfoCardProperties = {
  cards: CardType[];
};

export function CardsInfoCard({ cards }: CardsInfoCardProperties) {
  return (
    <DashboardCard title="Топливные карты">
      <KPIBox label="Всего карт" value={totalCards} />
      <KPIBox label="Заблокированных карт" value={blockedCards} />
    </DashboardCard>
  );
}

type FuelBalanceCardProperties = {
  fuelWallet: { fuelid: number; remain: number }[];
  nomenclature: { fuelid: number; fuelname: string }[];
};

export function FuelBalanceCard({
  fuelWallet,
  nomenclature,
}: FuelBalanceCardProperties) {
  const chartData = fuelWallet.map((w) => {
    const fuelInfo = nomenclature.find((n) => n.fuelid === w.fuelid);
    return {
      name: fuelInfo ? fuelInfo.fuelname : 'Неизвестно',
      value: w.remain,
    };
  });

  return (
    <DashboardCard title="Остатки топлива">
      <ChartBox data={chartData} chartType="bar" />
    </DashboardCard>
  );
}

type TopUsedCardsCardProperties = {
  cards: CardType[];
  transactions: TransactionType[];
  periodDays?: number;
  count?: number;
};

export function TopUsedCardsCard({
  cards,
  transactions,
  periodDays = 7,
  count = 3,
}: TopUsedCardsCardProperties) {
  const end = dayjs();
  const start = end.subtract(periodDays, 'day');

  const periodTx = transactions.filter(
    (tx) => dayjs(tx.dt).isBetween(start, end) && tx.op === -1,
  );
  // Суммируем объем по картам
  const volumeByCard: Record<number, number> = {};
  for (const tx of periodTx) {
    volumeByCard[tx.cardnum] = (volumeByCard[tx.cardnum] || 0) + tx.volume;
  }

  // Сортируем карты по использованному объему
  const sorted = cards
    .map((c) => ({ card: c, volume: volumeByCard[c.cardnum] || 0 }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, count)
    .map((item) => ({
      label: `Карта #${item.card.cardnum} (${item.card.cardowner})`,
      value: `${item.volume} л за ${periodDays} дн.`,
    }));

  return (
    <DashboardCard title="Самые используемые карты">
      <DataListTable items={sorted} />
    </DashboardCard>
  );
}

type NearingLimitCardsCardProperties = {
  cards: CardType[];
  threshold?: number; // процентаж, например 90%
};

export function NearingLimitCardsCard({
  cards,
  threshold = 90,
}: NearingLimitCardsCardProperties) {
  // Считаем, что nearing limit - это если оставшийся лимит < threshold% от общего
  const nearing = cards
    .filter((c) => {
      if (c.monthlimit > 0) {
        const usedPercent =
          ((c.monthlimit - c.monthremain) / c.monthlimit) * 100;
        return usedPercent >= threshold;
      }
      return false;
    })
    .map((c) => {
      const usedPercent = ((c.monthlimit - c.monthremain) / c.monthlimit) * 100;
      return {
        label: `Карта #${c.cardnum} (${c.cardowner})`,
        value: `Лимит: ${usedPercent.toFixed(1)}% использовано`,
      };
    });

  return (
    <DashboardCard title="Карты с низким лимитом">
      <DataListTable items={nearing} />
    </DashboardCard>
  );
}
