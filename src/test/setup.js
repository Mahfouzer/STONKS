// src/test/setup.js
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
  };
});
window.IntersectionObserver = mockIntersectionObserver;