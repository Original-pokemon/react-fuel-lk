import { Dayjs } from "dayjs";
import { MonthlyExpensesData } from "#root/types/monthly-expenses";
import CompactExpensesTable from "./CompactExpensesTable";

type MonthlyExpensesViewProperties = {
  data: MonthlyExpensesData;
  startDate: Dayjs;
  endDate: Dayjs;
  onGenerateReport: (monthKey: string) => void;
  isMonthLoading: (monthKey: string) => boolean;
  isMonthCached: (monthKey: string) => boolean;
};

function MonthlyExpensesView({
  data,
  startDate,
  endDate,
  onGenerateReport,
  isMonthLoading,
  isMonthCached,
}: MonthlyExpensesViewProperties) {
  return (
    <CompactExpensesTable
      data={data}
      startDate={startDate}
      endDate={endDate}
      onGenerateReport={onGenerateReport}
      isMonthLoading={isMonthLoading}
      isMonthCached={isMonthCached}
    />
  );
}

export default MonthlyExpensesView;
