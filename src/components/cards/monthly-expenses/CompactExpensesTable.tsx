import { Typography, Box } from '@mui/material';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import * as XLSX from 'xlsx';
import { useAppSelector } from '#root/hooks/state';
import { getAllTransactions } from '#root/store';
import { getFirmName } from '#root/store/slice/firm/selectors';
import { MonthlyExpensesData } from '#root/types/monthly-expenses';
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

      // Создаем Excel файл напрямую из данных
      const workbook = XLSX.utils.book_new();

      // Заголовки
      const headers = [
        'День /Номенклатура',
        'Дата время',
        'АЗС',
        'Адрес',
        'Карта',
        'Держатель',
        'Количество',
        'Цена на АЗС',
        'Цена',
        'Сумма',
      ];

      const excelData: (string | number)[][] = [];

      // Заголовок отчета
      excelData.push([
        `Расход по чиповым картам с ${reportStartDate.split('-').reverse().join('.')} по ${reportEndDateString.split('-').reverse().join('.')} ${firmName}`,
      ]);
      excelData.push(headers);

      // Группировка транзакций по картам
      const cardMap = new Map<number, typeof monthTransactions>();

      monthTransactions.forEach((transaction) => {
        const cardNum = transaction.cardnum;
        if (!cardMap.has(cardNum)) {
          cardMap.set(cardNum, []);
        }
        cardMap.get(cardNum)!.push(transaction);
      });

      let grandTotalVolume = 0;
      let grandTotalAmount = 0;

      // Для каждой карты
      cardMap.forEach((cardTransactions, cardNumber) => {
        // Группировка по видам топлива
        const fuelMap = new Map<number, typeof cardTransactions>();
        cardTransactions.forEach((transaction) => {
          const fuelId = transaction.fuelid;
          if (!fuelMap.has(fuelId)) {
            fuelMap.set(fuelId, []);
          }
          fuelMap.get(fuelId)!.push(transaction);
        });

        let cardTotalVolume = 0;
        let cardTotalAmount = 0;

        fuelMap.forEach((fuelTransactions, fuelId) => {
          const fuelName =
            nomenclature.find((n) => n.fuelid === fuelId)?.fuelname ||
            `Топливо ${fuelId}`;

          let fuelTotalVolume = 0;
          let fuelTotalAmount = 0;

          // Сортировка транзакций по дате
          fuelTransactions.sort((a, b) => a.dt.localeCompare(b.dt));

          // Каждая транзакция
          fuelTransactions.forEach((transaction) => {
            const formattedDateTime = dayjs(transaction.dt).format(
              'DD.MM.YYYY HH:mm:ss',
            );
            const { volume } = transaction;
            const amount = Math.abs(transaction.summa);

            fuelTotalVolume += volume;
            fuelTotalAmount += amount;

            excelData.push([
              '',
              formattedDateTime,
              `АЗС №${transaction.azs}`,
              '',
              cardNumber,
              '',
              volume,
              transaction.price,
              transaction.price,
              amount,
            ]);
          });

          cardTotalVolume += fuelTotalVolume;
          cardTotalAmount += fuelTotalAmount;

          // Строка итога по виду топлива
          excelData.push([
            fuelName,
            '',
            '',
            '',
            '',
            '',
            fuelTotalVolume,
            '',
            '',
            fuelTotalAmount,
          ]);
        });

        grandTotalVolume += cardTotalVolume;
        grandTotalAmount += cardTotalAmount;

        // Строка итога по карте
        excelData.push([
          cardNumber, // Оставляем как число
          '',
          '',
          '',
          '',
          '',
          cardTotalVolume,
          '',
          '',
          cardTotalAmount,
        ]);
      });

      // Добавляем пустую строку перед итогами
      excelData.push(['']);

      // Итоговая таблица по видам топлива
      excelData.push(['Итог:', '', 'Количество', '', 'Сумма']);

      // Собираем итоги по каждому виду топлива
      const fuelTotalsMap = new Map<
        number,
        { volume: number; amount: number }
      >();

      monthTransactions.forEach((transaction) => {
        const fuelId = transaction.fuelid;
        if (!fuelTotalsMap.has(fuelId)) {
          fuelTotalsMap.set(fuelId, { volume: 0, amount: 0 });
        }
        const total = fuelTotalsMap.get(fuelId)!;
        total.volume += transaction.volume;
        total.amount += Math.abs(transaction.summa);
      });

      // Добавляем строки для каждого вида топлива
      fuelTotalsMap.forEach((total, fuelId) => {
        const fuelName =
          nomenclature.find((n) => n.fuelid === fuelId)?.fuelname ||
          `Топливо ${fuelId}`;
        excelData.push([fuelName, '', total.volume, '', total.amount]);
      });

      // Создаем worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Настройка ширины столбцов
      worksheet['!cols'] = [
        { wch: 20 }, // День /Номенклатура
        { wch: 20 }, // Дата время
        { wch: 15 }, // АЗС
        { wch: 50 }, // Адрес
        { wch: 12 }, // Карта
        { wch: 20 }, // Держатель
        { wch: 12 }, // Количество
        { wch: 12 }, // Цена на АЗС
        { wch: 10 }, // Цена
        { wch: 12 }, // Сумма
      ];

      // Форматирование чисел и добавление границ
      if (worksheet['!ref']) {
        const range = XLSX.utils.decode_range(worksheet['!ref']);

        // Определяем стиль границ
        const borderStyle = {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        };

        // Стиль для заголовка (жирный + границы)
        const headerStyle = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: borderStyle,
          fill: { fgColor: { rgb: 'D3D3D3' } },
        };

        // Стиль для итоговых строк
        const totalStyle = {
          font: { bold: true },
          border: borderStyle,
          fill: { fgColor: { rgb: 'FFFF99' } },
        };

        for (let row = 0; row <= range.e.r; row++) {
          for (let col = 0; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];

            if (!cell) continue;

            // Инициализируем стиль ячейки
            if (!cell.s) cell.s = {};

            // Применяем границы ко всем ячейкам начиная со строки заголовков (row 1)
            if (row >= 1) {
              cell.s.border = borderStyle;
            }

            // Стиль для заголовков (row 1)
            if (row === 1) {
              cell.s = { ...cell.s, ...headerStyle };
            }

            // Форматирование чисел
            if (row >= 2 && typeof cell.v === 'number') {
              // Карта (колонка E, индекс 4) - отображаем как целое число
              if (col === 4) {
                cell.z = '0';
              }
              // Количество (колонка G, индекс 6)
              if (col === 6) {
                cell.z = '0.00';
              }
              // Цена на АЗС (колонка H, индекс 7)
              if (col === 7) {
                cell.z = '0.00';
              }
              // Цена (колонка I, индекс 8)
              if (col === 8) {
                cell.z = '0.00';
              }
              // Сумма (колонка J, индекс 9)
              if (col === 9) {
                cell.z = '0.00';
              }
            }

            // Выделяем строки с итогами (содержат название топлива или номер карты без даты)
            const cellValueStr = String(cell.v || '');
            const isFirstColumn = col === 0;
            const nextCell =
              worksheet[XLSX.utils.encode_cell({ r: row, c: 1 })];
            const nextCellEmpty = !nextCell || !nextCell.v;

            // Если это первая колонка, и следующая колонка пустая, и это не пустая строка
            if (isFirstColumn && nextCellEmpty && cellValueStr && row > 1) {
              // Применяем стиль итоговой строки ко всей строке
              for (let c = 0; c <= range.e.c; c++) {
                const totalCellAddress = XLSX.utils.encode_cell({ r: row, c });
                const totalCell = worksheet[totalCellAddress];
                if (totalCell) {
                  totalCell.s = { ...totalCell.s, ...totalStyle };
                }
              }
            }
          }
        }
      }

      // Добавляем автофильтр к заголовкам
      worksheet['!autofilter'] = { ref: `A2:J2` };

      // Закрепляем строки (заголовок и строку с названиями столбцов)
      worksheet['!freeze'] = {
        xSplit: 0,
        ySplit: 2,
        topLeftCell: 'A3',
        activePane: 'bottomLeft',
      };

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Отчет');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true,
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Создаем и скачиваем файл
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `расход_по_чиповым_картам_${monthData.monthName.toLowerCase()}.xlsx`,
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
