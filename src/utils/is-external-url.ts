/**
 * Check if URL is external (a full domain/protocol)
 */
export function isExternalUrl(url?: string): boolean {
  if (!url) {
    return false
  }

  // If it starts with http:// or https://, it's external
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true
  }

  // If it starts with //, it's a protocol-relative URL (also external)
  if (url.startsWith('//')) {
    return true
  }

  return false
}
