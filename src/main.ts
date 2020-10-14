import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import 'bootstrap/dist/css/bootstrap.css'

Vue.config.productionTip = false;

// Load other components
const requireComponent = (require as any).context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders 
  true,
  // The regular expression used to match base component filenames
  /.+\.(vue|js|ts)$$/
)
requireComponent.keys().forEach((fileName: any) => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
