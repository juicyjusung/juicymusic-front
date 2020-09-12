import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Main.vue';
import Store from '@/store';
import Login from '@/views/Login.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: Home,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/',
        name: 'Main',
        component: Home,
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: () => import(/* webpackChunkName: "about" */ '../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const isSessionActive = await Store.dispatch('auth/initiateAppSession');
      if (
        !isSessionActive ||
        localStorage.getItem('userId') === 'null' ||
        localStorage.getItem('userName') === 'null'
      ) {
        next({
          path: '/login',
        });
      } else {
        const moveForward = to.matched.some(rec => {
          const keys = Object.keys(rec.meta);
          return keys.length === 0;
        });

        if (moveForward) {
          next();
        } else {
          next('Main');
        }
      }
    } catch (e) {
      next({
        path: '/login',
      });
    }
  } else {
    next();
  }
});

export default router;
