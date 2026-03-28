import '@testing-library/jest-dom'
import { beforeAll, afterEach, vi } from 'vitest'

// Mock fetch globally
global.fetch = vi.fn()

// Mock window APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'test-user-agent',
  },
  writable: true,
})

// Mock location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
  },
  writable: true,
})

// Global test cleanup
afterEach(() => {
  vi.clearAllMocks()
})

// Test timeout
beforeAll(() => {
  vi.setConfig({
    testTimeout: 10000,
    hookTimeout: 5000,
  })
})
