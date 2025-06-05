import AutoImport from 'unplugin-auto-import/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

export const vitePluginAutoImport = () =>
  AutoImport({
    include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
    imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'], // global imports to register
    dirs: ['./src/hooks/*.ts*', './src/components'],
    eslintrc: {
      enabled: true,
      filepath: './.oxlint-auto-import.json',
      globalsPropValue: true,
    },
    dts: './src/auto-imports.d.ts',
    resolvers: [PrimeVueResolver()],
  })
