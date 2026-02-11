import { useState } from "react";
import { Alert, AlertTitle, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type AlertItem = {
  id: string;
  severity: "info" | "warning" | "success" | "error";
  title?: string;
  message: string;
};

const ALERTS: AlertItem[] = [
  {
    id: "report-generation-2026-02",
    severity: "info",
    message:
      'Сообщаем Вам, что в ЛК юридического лица стал доступен для скачивания в формате эксель и пдф "Отчет по расходу топлива по картам" в разделе "КАРТЫ / Отчет по топливу". Отчет можно будет скачать не ранее 5 числа за истекший месяц. Также, для более оперативной информации возможно посмотреть общий расход по карте сразу на сайте, щелкнув для раскрытия информации на месяц расхода в данном разделе.',
  },
];

const STORAGE_KEY = "ortk_dismissed_alerts";

function getDismissedAlertIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDismissedAlertId(id: string) {
  try {
    const dismissed = getDismissedAlertIds();
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
    }
  } catch {
    // localStorage недоступен
  }
}

function AlertBanner() {
  const [dismissedIds, setDismissedIds] =
    useState<string[]>(getDismissedAlertIds);

  const visibleAlerts = ALERTS.filter(
    (alert) => !dismissedIds.includes(alert.id),
  );

  if (visibleAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    saveDismissedAlertId(id);
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
      {visibleAlerts.map((alert) => (
        <Alert
          key={alert.id}
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => handleDismiss(alert.id)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
          {alert.message}
        </Alert>
      ))}
    </Box>
  );
}

export default AlertBanner;
