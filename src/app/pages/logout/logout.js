import router from '@/router';
import Auth from '@/_reactivestack/auth';

export default {
	name: 'Logout',

	route() {
		return {path: '/logout', component: this};
	},

	beforeCreate() {
		Auth.logout();
		router.push('/');
	}
};
