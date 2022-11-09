import { createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import prod from './env/prod.json'

export const config = createConfig({
  dev,
  prod
})