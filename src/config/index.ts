import { Env, createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import prod from './env/prod.json'

export const config = createConfig(
  {
    [Env.DEVELOPMENT]: dev,
    [Env.PRODUCTION]: prod,
  },
  {
    systemEnvVariables: {
      REACT_APP_DCL_DEFAULT_ENV:
        process.env.VITE_REACT_APP_DCL_DEFAULT_ENV ?? 'dev',
    },
  }
)
