import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { formatNumberWithSpaces } from '#root/utils/format-number';
import { MonthlyExpenseSummary } from '#root/types/monthly-expenses';
import ExpensesTable from './ExpensesTable';

type MonthAccordionProperties = {
  month: MonthlyExpenseSummary;
  expanded: boolean;
  onToggle: (monthKey: string) => void;
  onDetailedReport: (monthKey: string) => void;
  reportLoading: boolean;
};

function MonthAccordion({
  month,
  expanded,
  onToggle,
  onDetailedReport,
  reportLoading,
}: MonthAccordionProperties) {
  return (
    <Accordion
      expanded={expanded}
      onChange={() => onToggle(month.month)}
      sx={{ mb: 2 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: 'grey.50',
          '&:hover': { bgcolor: 'grey.100' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6">{month.monthName}</Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: 'bold' }}
              >
                Объем: {formatNumberWithSpaces(month.totalVolume)} л
              </Typography>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: 'bold' }}
              >
                Сумма: {formatNumberWithSpaces(month.totalAmount)} ₽
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AssessmentIcon />}
              onClick={(event) => {
                event.stopPropagation();
                onDetailedReport(month.month);
              }}
              disabled={reportLoading}
              sx={{ minWidth: 'auto' }}
            >
              {reportLoading ? 'Формирование...' : 'Скачать подробный отчет'}
            </Button>
          </Box>
        </Box>
      </AccordionSummary>

      {expanded && (
        <AccordionDetails sx={{ p: 0 }}>
          <ExpensesTable cards={month.cards} />
        </AccordionDetails>
      )}
    </Accordion>
  );
}

export default MonthAccordion;
