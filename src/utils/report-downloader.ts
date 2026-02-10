import { toast } from 'react-toastify';
import { APIRoute } from '#root/store/api-route';
import type {
    ReportResponse,
    DownloadReportParams,
    ReportFormat,
} from '#root/types/card-report';

// Функция для декодирования base64 в ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// Конфигурация для разных форматов
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
} as const satisfies Record<ReportFormat, {
    mimeType: string;
    extension: string;
    successMessage: string;
    errorMessage: string
}>;

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

        // Получаем base64 строку нужного формата из ответа
        const base64Data = response.data[format];

        if (!base64Data) {
            throw new Error(`${format.toUpperCase()} data not found in response`);
        }

        // Декодируем base64 в бинарные данные
        const arrayBuffer = base64ToArrayBuffer(base64Data);

        // Получаем конфигурацию для выбранного формата
        const config = FORMAT_CONFIG[format];

        // Создаем blob из бинарных данных
        const blob = new Blob([arrayBuffer], {
            type: config.mimeType,
        });

        // Создаем ссылку для скачивания
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Формируем имя файла
        const dateRangeStr = `${startDate.format('DD.MM.YYYY')}_${endDate.format('DD.MM.YYYY')}`;
        const fileName = `Транзации_по_чиповым_картам_${dateRangeStr}.${config.extension}`;
        link.setAttribute('download', fileName);

        // Добавляем ссылку в DOM, кликаем и удаляем ???
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Освобождаем память
        window.URL.revokeObjectURL(url);

        toast.success(config.successMessage);
    } catch (error) {
        console.error(`Error downloading ${format.toUpperCase()} report:`, error);
        toast.error(FORMAT_CONFIG[format].errorMessage);
        throw error;
    }
};
