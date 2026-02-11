import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import { formatNumberWithSpaces } from "#root/utils/format-number";
import { MonthlyExpenseSummary } from "#root/types/monthly-expenses";
import ExpensesTable from "./ExpensesTable";

type MonthAccordionProperties = {
  month: MonthlyExpenseSummary;
  expanded: boolean;
  onToggle: (monthKey: string) => void;
  onGenerateReport: (monthKey: string) => void;
  reportLoading: boolean;
  isReportCached: boolean;
};

function MonthAccordion({
  month,
  expanded,
  onToggle,
  onGenerateReport,
  reportLoading,
  isReportCached,
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
          bgcolor: "grey.50",
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">{month.monthName}</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: "bold" }}
              >
                Объем: {formatNumberWithSpaces(month.totalVolume)} л
              </Typography>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: "bold" }}
              >
                Сумма: {formatNumberWithSpaces(month.totalAmount)} ₽
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              size="small"
              variant={isReportCached ? "contained" : "outlined"}
              startIcon={
                reportLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DescriptionIcon />
                )
              }
              onClick={(event) => {
                event.stopPropagation();
                onGenerateReport(month.month);
              }}
              disabled={reportLoading}
              sx={{ minWidth: "auto" }}
            >
              {reportLoading
                ? "Загрузка..."
                : isReportCached
                  ? "Показать отчет"
                  : "Скачать отчет"}
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
