import { create } from "zustand";
import type { AxiosInstance } from "axios";
import { Status } from "#root/const";
import type { StatusType } from "#root/types/status";
import { APIRoute } from "./api-route";

interface ReportData {
  pdf: string;
  xlsx: string;
}

interface ReportState {
  status: StatusType;
  cache: Map<string, ReportData>;
  currentReport: ReportData | null;
  loadingMonthKeys: Set<string>;
  fetchReport: (
    monthKey: string,
    firmId: number,
    api: AxiosInstance,
  ) => Promise<void>;
  getReport: (monthKey: string, firmId: number) => ReportData | null;
  clearCurrentReport: () => void;
  clearCache: () => void;
  isMonthLoading: (monthKey: string) => boolean;
  isMonthCached: (monthKey: string, firmId: number) => boolean;
}

export const useReportStore = create<ReportState>((set, get) => ({
  status: Status.Idle,
  cache: new Map(),
  currentReport: null,
  loadingMonthKeys: new Set(),

  fetchReport: async (monthKey: string, firmId: number, api: AxiosInstance) => {
    const cacheKey = `${firmId}-${monthKey}`;
    const { cache, loadingMonthKeys } = get();

    // Проверяем кеш
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey)!;
      set({ currentReport: cachedData, status: Status.Success });
      return;
    }

    // Добавляем месяц в набор загружающихся
    const newLoadingKeys = new Set(loadingMonthKeys);
    newLoadingKeys.add(monthKey);
    set({ status: Status.Loading, loadingMonthKeys: newLoadingKeys });

    try {
      // Парсим monthKey формата "YYYY-M" (например "2025-8")
      const [year, month] = monthKey.split("-");

      // Создаем даты начала и конца месяца
      const monthStart = new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1,
        1,
      );
      const monthEnd = new Date(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10),
        0,
      );

      const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      };

      const response = await api.get<ReportData>(APIRoute.Report, {
        params: {
          fromdate: formatDate(monthStart),
          todate: formatDate(monthEnd),
          firmid: firmId,
        },
      });

      // Сохраняем в кеш (читаем актуальный cache через get())
      const currentCache = new Map(get().cache);
      currentCache.set(cacheKey, response.data);

      // Удаляем месяц из набора загружающихся
      const updatedLoadingKeys = new Set(get().loadingMonthKeys);
      updatedLoadingKeys.delete(monthKey);

      set({
        cache: currentCache,
        currentReport: response.data,
        status: updatedLoadingKeys.size > 0 ? Status.Loading : Status.Success,
        loadingMonthKeys: updatedLoadingKeys,
      });
    } catch (error) {
      console.error("Ошибка при загрузке отчета:", error);

      // Удаляем месяц из набора загружающихся даже при ошибке
      const updatedLoadingKeys = new Set(get().loadingMonthKeys);
      updatedLoadingKeys.delete(monthKey);

      set({ status: Status.Error, loadingMonthKeys: updatedLoadingKeys });
      throw error;
    }
  },

  getReport: (monthKey: string, firmId: number) => {
    const cacheKey = `${firmId}-${monthKey}`;
    return get().cache.get(cacheKey) || null;
  },

  clearCurrentReport: () => {
    set({ currentReport: null });
  },

  clearCache: () => {
    set({ cache: new Map(), currentReport: null });
  },

  isMonthLoading: (monthKey: string) => {
    return get().loadingMonthKeys.has(monthKey);
  },

  isMonthCached: (monthKey: string, firmId: number) => {
    const cacheKey = `${firmId}-${monthKey}`;
    return get().cache.has(cacheKey);
  },
}));
