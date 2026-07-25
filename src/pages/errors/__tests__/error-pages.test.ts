import { describe, expect, it } from 'vitest'

import { resolveErrorPage } from '../data/error-pages'

describe('resolveErrorPage', () => {
  it.each([
    ['401', 'Unauthorized'],
    ['403', 'Forbidden'],
    ['404', 'Page Not Found'],
    ['500', 'Internal Server Error'],
    ['503', 'Service Unavailable'],
  ])('resolves supported error code %s', (code, subtitle) => {
    expect(resolveErrorPage(code)).toMatchObject({
      code: Number(code),
      subtitle,
    })
  })

  it.each(['999', 'unexpected', ''])('falls back to 404 for unsupported code %j', (code) => {
    expect(resolveErrorPage(code)).toMatchObject({
      code: 404,
      subtitle: 'Page Not Found',
    })
  })
})
