interface ErrorPage {
  code: number
  subtitle: string
  error: string
}

type ErrorCode = '401' | '403' | '404' | '500' | '503'
type ErrorPageContent = Omit<ErrorPage, 'code'>

const FALLBACK_ERROR_CODE: ErrorCode = '404'

const ERROR_PAGE_MAP: Record<ErrorCode, ErrorPageContent> = {
  401: {
    subtitle: 'Unauthorized',
    error: 'You are not authorized to access this page.',
  },
  403: {
    subtitle: 'Forbidden',
    error: 'You are not authorized to access this page.',
  },
  404: {
    subtitle: 'Page Not Found',
    error: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
  },
  500: {
    subtitle: 'Internal Server Error',
    error: 'The server encountered an unexpected condition which prevented it from fulfilling the request.',
  },
  503: {
    subtitle: 'Service Unavailable',
    error: 'The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.',
  },
}

function isErrorCode(code: string): code is ErrorCode {
  return Object.hasOwn(ERROR_PAGE_MAP, code)
}

export function resolveErrorPage(code: string): ErrorPage {
  const resolvedCode = isErrorCode(code) ? code : FALLBACK_ERROR_CODE

  return {
    code: Number(resolvedCode),
    ...ERROR_PAGE_MAP[resolvedCode],
  }
}
