import { defineConfig, type CommonServerOptions } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const commonOptions: CommonServerOptions = { open: true, host: true }

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: { target: 'ESNext' },
  server: { ...commonOptions, port: 5_174 },
  preview: { ...commonOptions, port: 5_175 },
})
