import { Dayjs } from 'dayjs';
import { AxiosInstance } from 'axios';

export type ReportFormat = 'xlsx' | 'pdf';

export type DownloadReportParams = {
    startDate: Dayjs;
    endDate: Dayjs;
    format: ReportFormat;
    firmId?: number;
    api: AxiosInstance;
};

export type ReportResponse = {
    pdf: string;
    xlsx: string;
};

export type FormatConfig = Record<ReportFormat, {
    mimeType: string;
    extension: string;
    successMessage: string;
    errorMessage: string;
}>;