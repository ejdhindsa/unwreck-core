import { buildScale } from '../generate/scale'

const BRAND = '#E4562A'

export const scales = {
  neutral: buildScale('neutral', { anchor: BRAND, chromaScale: 0.055 }),
  brand: buildScale('brand', { anchor: BRAND }),
  success: buildScale('success', { anchor: '#12A150', onSolid: 'dark' }),
  warning: buildScale('warning', { anchor: '#D9A000', onSolid: 'dark' }),
  danger: buildScale('danger', { anchor: '#D62C2C', onSolid: 'light' }),
  info: buildScale('info', { anchor: '#2E7FD4', onSolid: 'light' }),
}
