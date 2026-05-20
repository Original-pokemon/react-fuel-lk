import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import { BACKEND_URL, REQUEST_TIMEOUT } from "./const";
import { getToken } from "./token";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Extend axios config to include retry count
declare module "axios" {
  interface InternalAxiosRequestConfig {
    retryCount?: number;
  }
}

type DetailMessageType = {
  type: string;
  message: string;
};

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: false,
  [StatusCodes.NOT_FOUND]: false,
  [StatusCodes.INTERNAL_SERVER_ERROR]: true,
};

const shouldDisplayError = (response: AxiosResponse) =>
  !!StatusCodeMapping[response.status];

const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor for retry logic
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Add retry count to config if not present
    if (config.retryCount === undefined) {
      config.retryCount = 0;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<DetailMessageType>) => {
      const { response, code } = error;
      const config = error.config as InternalAxiosRequestConfig;

      if (!config) {
        throw error;
      }

      // Check if we should retry
      const isIdempotent = ["get", "head", "options"].includes(
        config.method?.toLowerCase() || "",
      );

      const shouldRetry =
        isIdempotent &&
        (!response ||
          (response.status >= 500 && response.status < 600) ||
          code === "ERR_NETWORK" ||
          code === "ECONNABORTED");

      if (shouldRetry && (config.retryCount || 0) < MAX_RETRIES) {
        config.retryCount = (config.retryCount || 0) + 1;

        // Wait before retrying with exponential backoff and jitter
        const jitter = Math.random() * 500;
        const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1) + jitter;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry the request
        return api(config);
      }

      // If we've exhausted retries or shouldn't retry, show error
      if (!response) {
        const errorResponseToastId = "error-response";
        if (!toast.isActive(errorResponseToastId)) {
          toast.error("Произошла ошибка при выполнении запроса", {
            toastId: errorResponseToastId,
          });
        }
      }
      if (response && shouldDisplayError(response)) {
        const ErrorMessage = {
          [StatusCodes.BAD_REQUEST]: "Некорректные данные.",
          [StatusCodes.UNAUTHORIZED]: "Неверные имя пользователя или пароль.",
          [StatusCodes.NOT_FOUND]: "Страница не найдена.",
          [StatusCodes.INTERNAL_SERVER_ERROR]: "Внутренняя ошибка сервера.",
        };

        if (response.status in ErrorMessage) {
          toast.warn<string>(
            ErrorMessage[response.status as keyof typeof ErrorMessage],
          );
        }
      }

      throw error;
    },
  );

  api.interceptors.request.use((config) => {
    const token = getToken();

    if (token && config.headers) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = token;
    }

    return config;
  });

  return api;
};

export const api = createAPI();

export default createAPI;
