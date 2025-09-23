export const prepareErrorResponse = (err: any, defaultMessage: string): ResponseError => {
    console.log('Prepare error response', err.data)
    console.log('Prepare error response', err?.detail?.message || defaultMessage || 'An error occurred')
    return { message: err?.detail?.message || err?.detail || defaultMessage || 'An error occurred', data: err?.data || null }
}

export interface ResponseError {
    message: string
    data?: {
        [key: string]: Array<string>
    }
}
