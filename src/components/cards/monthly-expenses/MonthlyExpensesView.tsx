import { Dayjs } from 'dayjs';
import { MonthlyExpensesData } from '#root/types/monthly-expenses';
import CompactExpensesTable from './CompactExpensesTable';

type MonthlyExpensesViewProperties = {
  data: MonthlyExpensesData;
  startDate: Dayjs;
  endDate: Dayjs;
  nomenclature?: { fuelid: number; fuelname: string }[];
};

function MonthlyExpensesView({
  data,
  startDate,
  endDate,
  nomenclature = [],
}: MonthlyExpensesViewProperties) {
  return (
    <CompactExpensesTable
      data={data}
      startDate={startDate}
      endDate={endDate}
      nomenclature={nomenclature}
    />
  );
}

export default MonthlyExpensesView;
