/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles/main.css'
import './styles/dropdown.css'
import './styles/scroll.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
import * as rules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import router from './router'

Object.keys(rules).forEach((rule) => {
  if (typeof (rules as any)[rule] === 'function') {
    defineRule(rule, (rules as any)[rule])
  }
})
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
})
setLocale('zh_TW')

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)

app.use(Vue3Toastify, {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: true,
} as ToastContainerOptions)

// app.use(Vue3ColorPicker)

app.component('VField', Field)
app.component('VForm', Form)
app.component('ErrorMessage', ErrorMessage)

app.component('VueDatePicker', VueDatePicker)
app.component('VMultiSelect', Multiselect)

app.mount('#app')
