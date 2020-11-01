import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './components/Home'
import Welcome from './components/Welcome'
import Users from './components/user/Users'
import Rights from './components/power/rights'
import Roles from './components/power/roles'
Vue.use(Router)

const router = new Router({
  routes: [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',
      component:Home,
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles}
      ],
      redirect: '/welcome'
    },

  ]
})
router.beforeEach((to,from,next) => {
  if(to.path === '/login') return next()
  const userToken = window.sessionStorage.getItem('token');
  if(!userToken) return next('/login')
  next();
})
export default router;
