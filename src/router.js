import {createRouter, createWebHistory} from 'vue-router';

import _ from 'lodash';

import About from './app/pages/about/About.vue';
import Lorem from './app/pages/lorem/Lorem.vue';
import Lorems from './app/pages/lorems/Lorems.vue';

import Logout from './app/pages/logout/Logout.vue';
import Social from './app/pages/login/Social.vue';

import Auth from './_reactivestack/auth';
import ClientSocket from '@/_reactivestack/client.socket';

const routes = [
	Lorems.route(),
	Lorem.route(),
	{path: '/about', component: About},
	Logout.route(),
	...Social.routes()
];
console.table(routes);

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

// https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes
// https://www.digitalocean.com/community/tutorials/how-to-set-up-vue-js-authentication-and-route-handling-using-vue-router#step-3-%E2%80%94-updating-the-vue-router-file

const _clean = (path) => {
	if (_.startsWith(path, '/')) path = path.substr(1);
	return path;
};

router.beforeEach(function (to, from, next) {
	ClientSocket.location(_clean(to.path));
	if (!Auth.loggedIn() && to.matched.some((route) => route.meta.requiresAuth)) return next('/about');
	next();
});

export default router;
