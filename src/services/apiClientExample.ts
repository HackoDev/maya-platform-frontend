/**
 * Example usage of BaseApiClient
 * This file demonstrates how to use the baseApiClient for different types of API calls
 */

import { BaseApiClient, apiClient, api, CONTENT_TYPES } from './baseApiClient'

// Example 1: Using the default apiClient instance
export async function exampleUsingDefaultClient() {
  try {
    // GET request with query parameters
    const usersResponse = await api.get('/api/users', { page: 1, limit: 10 })
    console.log('Users:', usersResponse.data)

    // POST request with JSON data
    const newUser = await api.post('/api/users', {
      name: 'John Doe',
      email: 'john@example.com'
    })
    console.log('Created user:', newUser.data)

    // PUT request with custom headers
    const updatedUser = await api.put('/api/users/123', {
      name: 'John Smith'
    }, {
      headers: {
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value'
      }
    })
    console.log('Updated user:', updatedUser.data)

  } catch (error) {
    console.error('API Error:', error)
  }
}

// Example 2: Creating a custom API client instance
export const customApiClient = new BaseApiClient(
  'https://api.example.com', // base URL
  {
    'Authorization': 'Bearer your-token',
    'X-API-Version': 'v1'
  }, // default headers
  15000 // timeout in ms
)

export async function exampleUsingCustomClient() {
  try {
    // All requests will use the base URL and default headers
    const data = await customApiClient.get('/users/profile')
    console.log('Profile data:', data.data)

    // Override headers for specific request
    const publicData = await customApiClient.get('/public/data', undefined, {
      headers: {
        'Authorization': '' // Remove auth for public endpoint
      }
    })
    console.log('Public data:', publicData.data)

  } catch (error) {
    console.error('Custom API Error:', error)
  }
}

// Example 3: File upload
export async function exampleFileUpload() {
  try {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    const file = fileInput?.files?.[0]
    
    if (file) {
      // Upload single file
      const uploadResponse = await api.uploadFile('/api/upload', file, {
        description: 'Profile picture',
        category: 'avatar'
      })
      console.log('Upload response:', uploadResponse.data)

      // Upload multiple files using FormData
      const formData = new FormData()
      formData.append('file1', file)
      formData.append('file2', file) // another file
      formData.append('metadata', JSON.stringify({ type: 'batch-upload' }))

      const batchUploadResponse = await api.uploadFile('/api/batch-upload', formData)
      console.log('Batch upload response:', batchUploadResponse.data)
    }
  } catch (error) {
    console.error('Upload error:', error)
  }
}

// Example 4: Different content types
export async function exampleDifferentContentTypes() {
  try {
    // JSON content type (default)
    const jsonResponse = await api.post('/api/data', { key: 'value' }, {
      headers: { 'Content-Type': CONTENT_TYPES.JSON }
    })

    // Form data content type
    const formResponse = await api.post('/api/form', {
      name: 'John',
      email: 'john@example.com'
    }, {
      headers: { 'Content-Type': CONTENT_TYPES.URL_ENCODED }
    })

    // Text content type
    const textResponse = await api.post('/api/text', 'Hello World', {
      headers: { 'Content-Type': CONTENT_TYPES.TEXT }
    })

    // XML content type
    const xmlData = '<user><name>John</name><email>john@example.com</email></user>'
    const xmlResponse = await api.post('/api/xml', xmlData, {
      headers: { 'Content-Type': CONTENT_TYPES.XML }
    })

    console.log('All responses:', { jsonResponse, formResponse, textResponse, xmlResponse })
  } catch (error) {
    console.error('Content type error:', error)
  }
}

// Example 5: File download
export async function exampleFileDownload() {
  try {
    // Download a file
    await api.downloadFile('/api/files/document.pdf', 'my-document.pdf')
    console.log('File downloaded successfully')
  } catch (error) {
    console.error('Download error:', error)
  }
}

// Example 6: Error handling
export async function exampleErrorHandling() {
  try {
    const response = await api.get('/api/nonexistent-endpoint')
    console.log('Response:', response.data)
  } catch (error: any) {
    if (error.status === 404) {
      console.log('Resource not found')
    } else if (error.status === 401) {
      console.log('Unauthorized - redirect to login')
    } else if (error.status === 500) {
      console.log('Server error - try again later')
    } else {
      console.log('Unexpected error:', error.message)
    }
  }
}

// Example 7: Request cancellation
export async function exampleRequestCancellation() {
  const controller = new AbortController()
  
  // Cancel request after 5 seconds
  setTimeout(() => {
    controller.abort()
  }, 5000)

  try {
    const response = await api.get('/api/slow-endpoint', undefined, {
      signal: controller.signal
    })
    console.log('Response received:', response.data)
  } catch (error: any) {
    if (error.message === 'Request timeout') {
      console.log('Request was cancelled due to timeout')
    } else {
      console.log('Other error:', error.message)
    }
  }
}

// Example 8: Setting up global configuration
export function setupGlobalApiConfiguration() {
  // Set base URL for all requests
  apiClient.setBaseURL('https://api.maya-platform.com')
  
  // Set default headers (e.g., authentication token)
  apiClient.setDefaultHeaders({
    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
    'X-Client-Version': '1.0.0',
    'Accept': 'application/json'
  })
  
  // Set default timeout
  apiClient.setDefaultTimeout(30000) // 30 seconds
}


