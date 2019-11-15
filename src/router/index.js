import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/Chat.vue'
import Navbar from '@/components/Navbar.vue'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import RoomsList from '@/components/RoomsList.vue'
import About from '@/components/About.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      // home page containing child components for chats and MUC
      name: 'home',
      path: '/',
      components: {
        navbar: Navbar,
        default: Home,
      },
      props: {
        default: true,
        navbar: false,
      },
      meta: {
        requiresAuth: true,
        displayContact: true,
      },
      children: [
        {
          // chat component
          name: 'chat',
          path: 'contacts/:jid',
          component: Chat,
          props: true,
          meta: {
            requiresAuth: true,
          },
        },
        {
          // public MUC component
          name: 'public muc',
          path: 'rooms/discover',
          component: RoomsList,
          meta: {
            requiresAuth: true,
          },
        },
        {
          // MUC component
          name: 'groupchat',
          path: 'rooms/:jid',
          component: Chat,
          props: (route) => ({
            jid: route.params.jid,
            isRoom: true,
          }),
          meta: {
            requiresAuth: true,
          },
        },
        {
          // about component
          name: 'about',
          path: 'about',
          component: About,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    {
      // login page
      name: 'login',
      path: '/login',
      component: Login,
    },
    {
      // redirect unknown path to homepage
      path: '*',
      redirect: {name: 'home'},
    },
  ],
})

router.beforeEach((to, from, next) => {
  // check if route require authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('auth') === null) {
      // user is not authenticated, route to login page
      return next({
        name: 'login',
        query: {redirect: to.fullPath},
      })

    }
    // valid auth, route to requested path
    return next()
  }
  // no auth required, route to requested path
  return next()
})

export default router
