import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    host: {},
  },
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/styles'
  ],
  modules: [
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('w3m-')
        }
      },
    },
  },
  runtimeConfig: {
    public: {
      walletConnectKey: process.env.NUXT_PUBLIC_WALLET_CONNECT_KEY,
      mumbaiKey: process.env.NUXT_PUBLIC_INFURA_MUMBAI_KEY,
      contractAddressERC20: process.env.NUXT_PUBLIC_CONTRACT_ADDRESS_ERC20
    }
  }
})
