import fs from 'fs'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
  const envDefaultPath = path.resolve(process.cwd(), `.env.default`)
  const envPath = path.resolve(process.cwd(), '.env')

  if (!fs.existsSync(envPath) && fs.existsSync(envDefaultPath)) {
    dotenv.config({ path: envDefaultPath })
  }

  const envVariables = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    define: {
      'process.env': {
        VITE_REACT_APP_DCL_DEFAULT_ENV:
          envVariables.VITE_REACT_APP_DCL_DEFAULT_ENV,
        VITE_BASE_URL: envVariables.VITE_BASE_URL,
      },
    },
    server: {
      proxy: {
        '/auth': {
          target: 'https://decentraland.zone',
          followRedirects: true,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: true,
    },
    base: envVariables.VITE_BASE_URL,
  }
})
