import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      VBtn: {
        color: 'indigo',
        variant: 'flat',
        rounded: 'lg',
      },
    }
  })
  app.vueApp.use(vuetify)
})
