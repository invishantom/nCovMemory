import Vue from 'vue';
import App from './App.vue';
import VueGitHubButtons from 'vue-github-buttons';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-github-buttons/dist/vue-github-buttons.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueGitHubButtons);
new Vue({
  render: (h) => h(App)
}).$mount('#app');
