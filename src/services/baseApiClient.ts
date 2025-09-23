/**
 * Base API Client
 * Provides HTTP request functionality with custom headers and content type support
 */

// Request configuration interface
export interface ApiRequestConfig {
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

// Response interface
export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

// Error interface
export interface ApiError {
  message: string
  status?: number
  statusText?: string
  data?: any
}

// Content type constants
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
} as const

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Base API Client class
 * Handles HTTP requests with customizable headers and content types
 */
export class BaseApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private defaultTimeout: number

  constructor(
    baseURL: string = '',
    defaultHeaders: Record<string, string> = {},
    defaultTimeout: number = 10000
  ) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': CONTENT_TYPES.JSON,
      ...defaultHeaders,
    }
    this.defaultTimeout = defaultTimeout
  }

  /**
   * Set base URL for all requests
   */
  setBaseURL(url: string): void {
    this.baseURL = url
  }

  /**
   * Set default headers for all requests
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  /**
   * Set default timeout for all requests
   */
  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout
  }

  /**
   * Get default headers
   */
  getDefaultHeaders(): Record<string, string> {
    return { ...this.defaultHeaders }
  }

  /**
   * Make HTTP request
   */
  private async request<T = any>(
    method: HttpMethod,
    url: string,
    data?: any,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      headers = {},
      timeout = this.defaultTimeout,
      signal,
    } = config

    // Build full URL
    const fullURL = this.baseURL ? `${this.baseURL}${url}` : url

    // Merge headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal,
    }

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        // For FormData, let the browser set the Content-Type header
        delete requestHeaders['Content-Type']
        requestOptions.body = data
      } else if (requestHeaders['Content-Type'] === CONTENT_TYPES.JSON) {
        requestOptions.body = JSON.stringify(data)
      } else if (requestHeaders['Content-Type'] === CONTENT_TYPES.URL_ENCODED) {
        requestOptions.body = new URLSearchParams(data).toString()
      } else {
        requestOptions.body = data
      }
    }

    // Add query parameters for GET requests
    let finalURL = fullURL
    if (data && method === 'GET') {
      try {
        const urlWithParams = new URL(fullURL)
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            urlWithParams.searchParams.append(key, String(value))
          }
        })
        finalURL = urlWithParams.toString()
      } catch (error) {
        // If URL construction fails (e.g., relative URLs), build query string manually
        const searchParams = new URLSearchParams()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        })
        const queryString = searchParams.toString()
        finalURL = queryString ? `${fullURL}?${queryString}` : fullURL
      }
    }

    try {
      // Create timeout controller
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      // Merge abort signals
      if (signal) {
        signal.addEventListener('abort', () => controller.abort())
      }

      requestOptions.signal = controller.signal

      // Make the request
      const response = await fetch(finalURL, requestOptions)
      clearTimeout(timeoutId)

      // Parse response headers
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Parse response data
      let responseData: any
      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        responseData = await response.json()
      } else if (contentType.includes('text/')) {
        responseData = await response.text()
      } else {
        responseData = await response.blob()
      }

      // Check if response is successful
      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        }
        throw error
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            message: 'Request timeout',
            status: 408,
            statusText: 'Request Timeout',
          } as ApiError
        }
        throw {
          message: error.message,
        } as ApiError
      }
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, params, config)
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config)
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config)
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config)
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config)
  }

  /**
   * Upload file with FormData
   */
  async uploadFile<T = any>(
    url: string,
    file: File | FormData,
    additionalData?: Record<string, any>,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    let formData: FormData

    if (file instanceof FormData) {
      formData = file
    } else {
      formData = new FormData()
      formData.append('file', file)
    }

    // Add additional data to FormData
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
    }

    return this.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        // Don't set Content-Type for FormData, let browser handle it
      },
    })
  }

  /**
   * Download file
   */
  async downloadFile(
    url: string,
    filename?: string,
    config?: ApiRequestConfig
  ): Promise<void> {
    const response = await this.request('GET', url, undefined, config)
    
    if (response.data instanceof Blob) {
      const blob = response.data
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } else {
      throw new Error('Response is not a file')
    }
  }
}

// Create default instance
export const apiClient = new BaseApiClient()

// Export convenience functions
export const api = {
  get: <T = any>(url: string, params?: Record<string, any>, config?: ApiRequestConfig) =>
    apiClient.get<T>(url, params, config),
  post: <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
    apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
    apiClient.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
    apiClient.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: ApiRequestConfig) =>
    apiClient.delete<T>(url, config),
  uploadFile: <T = any>(url: string, file: File | FormData, additionalData?: Record<string, any>, config?: ApiRequestConfig) =>
    apiClient.uploadFile<T>(url, file, additionalData, config),
  downloadFile: (url: string, filename?: string, config?: ApiRequestConfig) =>
    apiClient.downloadFile(url, filename, config),
}



