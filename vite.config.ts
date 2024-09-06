import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    plugins: [react(), nodePolyfills()],
    define: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'process.env': {
        VITE_REACT_APP_DCL_DEFAULT_ENV:
          envVariables.VITE_REACT_APP_DCL_DEFAULT_ENV,
        VITE_BASE_URL: envVariables.VITE_BASE_URL,
      },
    },
    server: {
      proxy: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
        // Node.js global to browser globalThis
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
