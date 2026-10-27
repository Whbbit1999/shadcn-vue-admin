import { describe, expect, it } from 'vitest'

import { resolveErrorPage } from '../data/error-pages'

describe('resolveErrorPage', () => {
  it.each([
    ['401', 'errors.unauthorized.title'],
    ['403', 'errors.forbidden.title'],
    ['404', 'errors.pageNotFound.title'],
    ['500', 'errors.internalServerError.title'],
    ['503', 'errors.serviceUnavailable.title'],
  ])('resolves supported error code %s', (code, subtitleKey) => {
    expect(resolveErrorPage(code)).toMatchObject({
      code: Number(code),
      subtitleKey,
    })
  })

  it.each(['999', 'unexpected', ''])('falls back to 404 for unsupported code %j', (code) => {
    expect(resolveErrorPage(code)).toMatchObject({
      code: 404,
      subtitleKey: 'errors.pageNotFound.title',
    })
  })

  it.each([
    ['401', 'errors.unauthorized.description'],
    ['403', 'errors.forbidden.description'],
    ['404', 'errors.pageNotFound.description'],
    ['500', 'errors.internalServerError.description'],
    ['503', 'errors.serviceUnavailable.description'],
  ])('exposes the description key for error code %s', (code, descriptionKey) => {
    expect(resolveErrorPage(code).descriptionKey).toBe(descriptionKey)
  })
})
