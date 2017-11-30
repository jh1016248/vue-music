import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/Index'
import Main from '@/page/Main'
import Find from '@/page/Find'
import SongSheet from '@/page/SongSheet'
import Login from '@/page/Login'
import Register from '@/page/Register'
import ChangeUserInfo from '@/page/ChangeUserInfo'
import PlayList from '@/page/PlayList'
import SheetList from '@/page/SheetList'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/Index',
            name: 'Index',
            component: Index,
            children: [
                {
                    path: '',
                    name: 'Main',
                    component: Main
                },
                {
                    path: 'main',
                    name: 'Main',
                    component: Main
                },
                {
                    path: 'find',
                    name: 'Find',
                    component: Find
                },
                {
                    path: 'songsheet',
                    name: 'songsheet',
                    component: SongSheet,
                    children: [
                        {
                            path: '',
                            name: 'sheetList',
                            component: SheetList
                        },
                        {
                            path: ':id',
                            name: 'playList',
                            component: PlayList,
                        }
                    ]
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/changeuserinfo',
            name: 'ChangeUserInfo',
            component: ChangeUserInfo
        }
    ]
})