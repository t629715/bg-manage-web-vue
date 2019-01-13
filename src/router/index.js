import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[

                {
                    path: '/',
                    name: '首页',
                    component: resolve => require(['../components/page/index'], resolve)
                },
                {
                    path: '/permissionManage',
                    name: '菜单管理',

                    component: resolve => require(['../components/page/sysMng/permissionManage.vue'], resolve)
                },
                {
                    path: '/roleManage',
                    name: '角色管理',
                    component: resolve => require(['../components/page/sysMng/roleManage.vue'], resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
