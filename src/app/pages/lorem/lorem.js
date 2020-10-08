import {ref, computed, watch} from 'vue';

import _ from "lodash";
import moment from "moment";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

import {loremStore} from "./_store/lorem.store";
import LoremUpdater from "./_store/lorem.updater";
import {jsonToGraphQLQuery} from "json-to-graphql-query";

let updater;
const VUE_APP_GRAPHQL_PATH = process.env.VUE_APP_GRAPHQL_PATH;

const _sendMutationQuery = async (command, __args, fields) => {
	const mutation = {};
	mutation[command] = {__args};
	mutation[command] = _.merge(mutation[command], fields);
	const mutationQuery = jsonToGraphQLQuery({mutation}, {pretty: true});

	const response = await fetch(VUE_APP_GRAPHQL_PATH, {
		method: 'POST',
		headers: AuthService.getAuthHeader(),
		body: JSON.stringify({query: mutationQuery})
	});
	return await response.json();
};

export default {
	name: 'Lorem',
	props: ['draftId'],

	setup(props) {
		let store = ref(loremStore);

		if (AuthService.loggedIn()) {
			if (updater) updater.destroy();
			updater = new LoremUpdater();
			updater.setConfig({_id: props.draftId});
		}

		const isDisabled = (fieldName) => {
			if (store.value.draft) {
				let meta = store.value.draft.meta;
				if (meta) {
					let field = _.get(meta, fieldName);
					if (field) {
						let user = _.get(field, 'user');
						return user !== AuthService.userId();
					}
				}
			}
			return false;
		};

		const isDraft = computed(() => !_.isEmpty(store.value.draft));

		watch(isDraft, (value) => {
			if (value !== true) router.push('/');
		});

		return {
			store,

			SPECIES: ['Human', 'Draenei', 'Dryad', 'Dwarf', 'Gnome', 'Worgde'],

			isDraft, isDisabled,

			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),

			onFocus: (field) => {
				if (isDisabled(field)) return;

				_sendMutationQuery('draftFocus', {
					draftId: store.value.draft._id,
					field
				});
			},

			onBlur: (field) => {
				_sendMutationQuery('draftBlur', {
					draftId: store.value.draft._id,
					field
				});
			},

			onChange: _.throttle(function (e) {
				let {target: {name: field, value}} = e;
				store.value.setValue(field, value);

				_sendMutationQuery('draftChange', {
					draftId: store.value.draft._id,
					change: {value, field}
				});
			}, 250, {'leading': true}),

			closeDialog: async () => {
				const completed = await _sendMutationQuery('draftCancel', {
					draftId: store.value.draft._id
				});
				if (completed) router.push('/');
				else console.error(' - closeDialog response', completed);  	// oops...
			},

			saveLorem: async () => {
				const completed = await _sendMutationQuery('draftSave', {
					draft: store.value.draft
				});
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
