/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/test/setup.js',
    testTimeout: 13000, // Increase timeout to 10 seconds
  }
})