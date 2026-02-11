import { Typography, Box } from "@mui/material";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { MonthlyExpensesData } from "#root/types/monthly-expenses";
import OverallTotals from "./OverallTotals";
import MonthAccordion from "./MonthAccordion";

type CompactExpensesTableProperties = {
  data: MonthlyExpensesData;
  startDate: Dayjs;
  endDate: Dayjs;
  onGenerateReport: (monthKey: string) => void;
  isMonthLoading: (monthKey: string) => boolean;
  isMonthCached: (monthKey: string) => boolean;
};

function CompactExpensesTable({
  data,
  startDate,
  endDate,
  onGenerateReport,
  isMonthLoading,
  isMonthCached,
}: CompactExpensesTableProperties) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  if (data.months.length === 0) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", mt: 4 }}
      >
        Нет данных о расходах за выбранный период
      </Typography>
    );
  }

  const handleMonthToggle = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Расходы по картам с {startDate.format("DD.MM.YYYY")} по{" "}
        {endDate.format("DD.MM.YYYY")}
      </Typography>

      {/* Общие итоги */}
      <OverallTotals
        totalVolume={data.totalVolume}
        totalAmount={data.totalAmount}
      />

      {/* Аккордеоны по месяцам */}
      {data.months.map((month) => (
        <MonthAccordion
          key={month.month}
          month={month}
          expanded={expandedMonths.has(month.month)}
          onToggle={handleMonthToggle}
          onGenerateReport={onGenerateReport}
          reportLoading={isMonthLoading(month.month)}
          isReportCached={isMonthCached(month.month)}
        />
      ))}
    </Box>
  );
}

export default CompactExpensesTable;
