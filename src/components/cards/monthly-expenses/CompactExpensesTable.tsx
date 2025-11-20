import { Typography, Box } from '@mui/material';
import { useState } from 'react';
import { Dayjs } from 'dayjs';
import { useAppSelector } from '#root/hooks/state';
import { getAllTransactions } from '#root/store';
import { getFirmName } from '#root/store/slice/firm/selectors';
import { MonthlyExpensesData } from '#root/types/monthly-expenses';
import { generateDetailedFuelReportFromTransactions } from './reports';
import OverallTotals from './OverallTotals';
import MonthAccordion from './MonthAccordion';

type CompactExpensesTableProperties = {
  data: MonthlyExpensesData;
  startDate: Dayjs;
  endDate: Dayjs;
  nomenclature?: { fuelid: number; fuelname: string }[];
};

function CompactExpensesTable({
  data,
  startDate,
  endDate,
  nomenclature = [],
}: CompactExpensesTableProperties) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [reportLoading, setReportLoading] = useState<string | undefined>();
  const transactions = useAppSelector(getAllTransactions);
  const firmName = useAppSelector(getFirmName);

  if (data.months.length === 0) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 4 }}
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

  const handleDetailedReport = async (monthKey: string) => {
    const monthData = data.months.find((m) => m.month === monthKey);
    if (!monthData) return;

    setReportLoading(monthKey);

    try {
      if (nomenclature.length === 0) {
        alert(
          'Номенклатура не загружена. Пожалуйста, подождите загрузки данных.',
        );
        return;
      }

      if (!firmName) {
        alert(
          'Информация о фирме не загружена. Пожалуйста, подождите загрузки данных.',
        );
        return;
      }

      const [year, month] = monthKey.split('-');
      const reportStartDate = `${year}-${month.padStart(2, '0')}-01`;
      const reportEndDate = new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10),
        0,
      );
      const reportEndDateString = reportEndDate.toISOString().split('T')[0];

      // Фильтруем существующие транзакции за месяц
      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = transaction.dt.split(' ')[0];
        return (
          transactionDate >= reportStartDate &&
          transactionDate <= reportEndDateString
        );
      });

      // Генерируем детальный отчет в требуемом формате
      const csvContent = generateDetailedFuelReportFromTransactions(
        monthTransactions,
        reportStartDate,
        reportEndDateString,
        firmName,
        nomenclature,
      );

      // Создаем и скачиваем файл
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `расход_по_чиповым_картам_${monthData.monthName.toLowerCase()}.csv`,
      );
      link.style.visibility = 'hidden';
      document.body.append(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Ошибка при формировании отчета:', error);
    } finally {
      setReportLoading(undefined);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Расходы по картам с {startDate.format('DD.MM.YYYY')} по{' '}
        {endDate.format('DD.MM.YYYY')}
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
          onDetailedReport={handleDetailedReport}
          reportLoading={reportLoading === month.month}
        />
      ))}
    </Box>
  );
}

export default CompactExpensesTable;
