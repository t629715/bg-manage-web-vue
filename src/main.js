import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import VueRource from 'vue-resource';
import common from '../static/js/common.js';
import store from './store/index';


Vue.use(VueRource);
Vue.use(common);

import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import './assets/common.js'
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

Vue.use(ElementUI);
Vue.use(VueRource);
//保证跨域请求的sessionid 不变
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;
Vue.prototype.global = localStorage;
//页面请求要使用   this.$axios.post格式
Vue.prototype.$axios = axios;
Vue.prototype.baseUrl = 'http://127.0.0.1:18089/';
Vue.global
Vue.prototype.$post = function (url, params) {  //  带有token  POST
    return this.$axios.post(
        {
            url: url,
            data: params,
            headers: {
                token: this.global.getItem("token")
            },
        })
};
Vue.prototype.$get = function (url) {  //  get
    return this.$axios.get({
        url: url,
        headers: {
            'token': this.global.getItem('token')
        }
    })
}
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

