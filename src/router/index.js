import Vue from 'vue';
import Router from 'vue-router';
import Pace from '@/components/Pace';
import paceSignedIn from '@/components/paceSignedIn';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PaceHome',
      component: Pace,
    },
    {
      path: '/pace',
      name: 'Pace',
      component: Pace,
    },
    {
      path: '/paceSignedIn',
      name: 'paceSignedIn',
      component: paceSignedIn,
    },
  ],
});
