import { toast } from 'react-toastify';
import { APIRoute } from '#root/store/api-route';
import type {
    ReportResponse,
    DownloadReportParams,
    FormatConfig,
} from '#root/types/card-report';

const base64ToArrayBuffer = (base64: string): ArrayBuffer =>
    Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;

const FORMAT_CONFIG = {
    xlsx: {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
        successMessage: 'Отчет Excel успешно скачан',
        errorMessage: 'Ошибка при скачивании Excel отчета',
    },
    pdf: {
        mimeType: 'application/pdf',
        extension: 'pdf',
        successMessage: 'Отчет PDF успешно скачан',
        errorMessage: 'Ошибка при скачивании PDF отчета',
    },
} as const satisfies FormatConfig

export const downloadReport = async ({
    startDate,
    endDate,
    format,
    firmid,
    api,
}: DownloadReportParams): Promise<void> => {
    try {
        const response = await api.get<ReportResponse>(APIRoute.Report, {
            params: {
                fromdate: startDate.format('DD.MM.YYYY'),
                todate: endDate.format('DD.MM.YYYY'),
                firmid,
            },
        });

        const base64Data = response.data[format];

        if (!base64Data) {
            throw new Error(`${format.toUpperCase()} data not found in response`);
        }

        // Декодируем base64 в бинарные данные
        const arrayBuffer = base64ToArrayBuffer(base64Data);

        const config = FORMAT_CONFIG[format];
        const blob = new Blob([arrayBuffer], {
            type: config.mimeType,
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const dateRangeStr = `${startDate.format('DD.MM.YYYY')}_${endDate.format('DD.MM.YYYY')}`;
        const fileName = `Транзакции_по_чиповым_картам_${dateRangeStr}.${config.extension}`;

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
        toast.success(config.successMessage);
    } catch (error) {
        console.error(`Error downloading ${format.toUpperCase()} report:`, error);
        toast.error(FORMAT_CONFIG[format].errorMessage);
        throw error;
    }
};
