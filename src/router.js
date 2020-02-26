import Vue from 'vue'
import Router from 'vue-router'

// 导入刚才编写的组件
import AppIndex from '@/components/home/AppIndex'
import Login from '@/components/Login'
import Home from '@/components/Home'
import LibraryIndex from '@/components/library/LibraryIndex'
import Register from "@/components/Register";
import PhoneLogin from "@/components/PhoneLogin";
import ForgetPwd from "@/components/ForgetPwd";

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', name: 'Login', component: Login },
        { path:'/register', name:'Register', component:Register},
        { path:'/phoneLogin', name:'PhoneLogin',component:PhoneLogin},
        { path:'/forgetPwd',name:'ForgetPwd',component:ForgetPwd},
        { path: '/home', name: 'Home', component: Home, // home页面并不需要被访问
          redirect: '/index',
          children: [
            {path: '/index', name: 'AppIndex', component: AppIndex, meta: {requireAuth: true}},
            {path: '/library', name: 'Library', component: LibraryIndex, meta: {requireAuth: true}}
            ]
        }
    ]
})

