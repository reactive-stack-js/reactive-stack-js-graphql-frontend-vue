import {ref, computed, watch} from 'vue';

import _ from "lodash";
import moment from "moment";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

import {loremStore} from "./_store/lorem.store";
import LoremUpdater from "./_store/lorem.updater";

let updater;
const VUE_APP_API_PATH = process.env.VUE_APP_API_PATH;

export default {
	name: 'Lorem',
	props: ['loremId'],

	store: loremStore,

	setup(props) {
		let store = ref(loremStore);

		if (AuthService.loggedIn()) {
			if (updater) updater.destroy();
			updater = new LoremUpdater();
			updater.setConfig({_id: props.loremId});
		}

		const isDisabled = (fieldName) => {
			if (store.lorem) {
				let meta = store.lorem.meta;
				if (meta) {
					let field = _.get(meta, fieldName);
					if (field) {
						let user = _.get(field, 'user');
						return user !== AuthService.user().id;
					}
				}
			}
			return false;
		};

		const isDraft = computed(() => store.lorem.isDraft);

		watch(isDraft, (value) => {
			if (value !== true) {
				// TODO: goto homepage...
			}
		});

		return {
			SPECIES: ['Human', 'Draenei', 'Dryad', 'Dwarf', 'Gnome', 'Worgde'],

			isDisabled, isDraft,

			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),

			onFocus: (field) => {
				if (this.isDisabled(field)) return;
				fetch(VUE_APP_API_PATH + '/api/lorem/focus/' + store.lorem._id, {
					method: 'POST',
					headers: AuthService.getAuthHeader(),
					body: JSON.stringify({field})
				});
			},

			onBlur: (field) => {
				fetch(VUE_APP_API_PATH + '/api/lorem/blur/' + store.lorem._id, {
					method: 'POST',
					headers: AuthService.getAuthHeader(),
					body: JSON.stringify({field})
				});
			},

			onChange: _.throttle(function (e) {
				let {target: {name: field, value}} = e;
				store.setValue(field, value);

				fetch(VUE_APP_API_PATH + '/api/lorem/change/' + store.lorem._id, {
					method: 'POST',
					headers: AuthService.getAuthHeader(),
					body: JSON.stringify({value, field})
				});
			}, 250, {'leading': true}),

			closeDialog: async () => {
				const response = await fetch(VUE_APP_API_PATH + '/api/lorem/cancel/' + store.lorem._id, {
					method: 'POST',
					headers: AuthService.getAuthHeader(),
					body: JSON.stringify({})
				});
				const completed = await response.json();
				if (completed) router.push('/');
				else console.error(' - closeDialog response', completed);  	// oops...
			},

			saveLorem: async () => {
				const response = await fetch(VUE_APP_API_PATH + '/api/lorem/save/', {
					method: 'POST',
					headers: AuthService.getAuthHeader(),
					body: JSON.stringify({document: store.lorem})
				});
				const completed = await response.json();
				if (completed) router.push('/');
				else console.error(' - saveLorem response', completed);	// oops...
			}
		}
	},

	beforeRouteLeave(to, from, next) {
		this.store.reset();
		if (updater) updater.destroy();
		updater = null;
		next();
	}
}
