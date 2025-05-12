import { createApp } from 'vue'
import App from './App'
import components from '@/components/UI';
import router from '@/router/router'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'    

const app = createApp(App)

components.forEach(component => {
    app.component(component.name, component)
})

app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
})
app
    .use(router)
    .mount('#app')
