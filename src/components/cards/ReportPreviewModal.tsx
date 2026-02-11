import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { base64ToDataUrl } from "#root/utils/file-download";

type ReportPreviewModalProperties = {
  open: boolean;
  pdfBase64: string | null;
  onClose: () => void;
  onDownloadPdf: () => void;
  onDownloadExcel: () => void;
};

function ReportPreviewModal({
  open,
  pdfBase64,
  onClose,
  onDownloadPdf,
  onDownloadExcel,
}: ReportPreviewModalProperties) {
  const pdfDataUrl = pdfBase64
    ? base64ToDataUrl(pdfBase64, "application/pdf")
    : "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <span>Предпросмотр отчета</span>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            width: "100%",
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {pdfDataUrl ? (
            <iframe
              src={pdfDataUrl}
              title="PDF Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          ) : (
            <span>Загрузка...</span>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onDownloadExcel}
          startIcon={<DownloadIcon />}
          variant="outlined"
        >
          Скачать Excel
        </Button>
        <Button
          onClick={onDownloadPdf}
          startIcon={<DownloadIcon />}
          variant="contained"
        >
          Скачать PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReportPreviewModal;
