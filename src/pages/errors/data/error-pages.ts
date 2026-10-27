interface ErrorPage {
  code: number
  subtitleKey: string
  descriptionKey: string
}

type ErrorCode = '401' | '403' | '404' | '500' | '503'
type ErrorPageContent = Omit<ErrorPage, 'code'>

const FALLBACK_ERROR_CODE: ErrorCode = '404'

const ERROR_PAGE_MAP: Record<ErrorCode, ErrorPageContent> = {
  401: {
    subtitleKey: 'errors.unauthorized.title',
    descriptionKey: 'errors.unauthorized.description',
  },
  403: {
    subtitleKey: 'errors.forbidden.title',
    descriptionKey: 'errors.forbidden.description',
  },
  404: {
    subtitleKey: 'errors.pageNotFound.title',
    descriptionKey: 'errors.pageNotFound.description',
  },
  500: {
    subtitleKey: 'errors.internalServerError.title',
    descriptionKey: 'errors.internalServerError.description',
  },
  503: {
    subtitleKey: 'errors.serviceUnavailable.title',
    descriptionKey: 'errors.serviceUnavailable.description',
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
