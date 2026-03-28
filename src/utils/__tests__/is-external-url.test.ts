import { describe, expect, it } from 'vitest'

import { isExternalUrl } from '../is-external-url'

describe('isExternalUrl', () => {
  describe('external URLs', () => {
    it('should return true for http URLs', () => {
      expect(isExternalUrl('http://example.com')).toBe(true)
      expect(isExternalUrl('http://example.com/path')).toBe(true)
    })

    it('should return true for https URLs', () => {
      expect(isExternalUrl('https://example.com')).toBe(true)
      expect(isExternalUrl('https://example.com/path')).toBe(true)
    })

    it('should return true for protocol-relative URLs', () => {
      expect(isExternalUrl('//example.com')).toBe(true)
      expect(isExternalUrl('//cdn.example.com/file.js')).toBe(true)
    })
  })

  describe('internal URLs', () => {
    it('should return false for absolute paths', () => {
      expect(isExternalUrl('/home')).toBe(false)
      expect(isExternalUrl('/dashboard/profile')).toBe(false)
    })

    it('should return false for relative paths', () => {
      expect(isExternalUrl('home')).toBe(false)
      expect(isExternalUrl('./dashboard')).toBe(false)
      expect(isExternalUrl('../parent')).toBe(false)
    })

    it('should return false for hash links', () => {
      expect(isExternalUrl('#section')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should return false for empty string', () => {
      expect(isExternalUrl('')).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isExternalUrl(undefined)).toBe(false)
    })

    it('should return false when no argument is passed', () => {
      expect(isExternalUrl()).toBe(false)
    })

    it('should handle URLs with query parameters', () => {
      expect(isExternalUrl('https://example.com?foo=bar')).toBe(true)
      expect(isExternalUrl('/path?foo=bar')).toBe(false)
    })

    it('should handle URLs with fragments', () => {
      expect(isExternalUrl('https://example.com#section')).toBe(true)
      expect(isExternalUrl('/path#section')).toBe(false)
    })
  })
})
