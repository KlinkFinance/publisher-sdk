import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ResolvedKlinkSDKConfig } from "../types/config";
import { KlinkAPIError, KlinkNetworkError, KlinkAuthError } from "../types/errors";
import { Logger } from "../utils/logger";
import { createAuthHeaders } from "../utils/auth";

/**
 * HTTP client for making authenticated API requests with retries
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: ResolvedKlinkSDKConfig;
  private logger: Logger;

  constructor(config: ResolvedKlinkSDKConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;

    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Klink-SDK/0.1.0",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add authentication
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`Making ${config.method?.toUpperCase()} request to ${config.url}`);

        // Add authentication headers (Bearer token)
        // apiSecret is optional - advertiser can use apiKey only
        const authHeaders = createAuthHeaders(this.config.apiKey, this.config.apiSecret);

        // Set auth headers (config.headers is always defined in axios interceptors)
        Object.entries(authHeaders).forEach(([key, value]) => {
          config.headers[key] = value;
        });

        return config;
      },
      (error) => {
        this.logger.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response received:`, {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      this.logger.error(`API Error ${status}:`, data);

      if (status === 401 || status === 403) {
        return new KlinkAuthError(`Authentication failed: ${this.extractErrorMessage(data)}`);
      }

      return new KlinkAPIError(
        this.extractErrorMessage(data) || `API request failed with status ${status}`,
        status,
        data
      );
    } else if (error.request) {
      // Request made but no response
      this.logger.error("Network error:", error.message);
      return new KlinkNetworkError(`Network error: ${error.message}`);
    } else {
      // Error in request setup
      this.logger.error("Request setup error:", error.message);
      return new KlinkNetworkError(`Request error: ${error.message}`);
    }
  }

  /**
   * Extract error message from API response
   */
  private extractErrorMessage(data: unknown): string {
    if (typeof data === "string") {
      return data;
    }
    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
      if ("error" in data && typeof data.error === "string") {
        return data.error;
      }
    }
    return "Unknown error";
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(path, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(path, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(path, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(path, config);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(path, data, config);
    return response.data;
  }
}
