import { Dayjs } from 'dayjs';
import { AxiosInstance } from 'axios';

export type ReportFormat = 'xlsx' | 'pdf';

export type DownloadReportParams = {
    startDate: Dayjs;
    endDate: Dayjs;
    format: ReportFormat;
    firmid?: number;
    api: AxiosInstance;
};

export type ReportResponse = {
    pdf: string;
    xlsx: string;
};