import {ref, computed, watch, onUnmounted} from 'vue';

import _ from 'lodash';
import moment from 'moment';

import router from '@/router';
import Auth from '@/_reactivestack/auth';
import ReactiveStore from '@/_reactivestack/store/reactive.store';
import sendMutationQuery from '@/functions/send.mutation.query';

export default {
	name: 'Lorem',
	props: ['draftId'],

	route() {
		return {path: '/lorem/:draftId', component: this, props: true};
	},

	setup(props) {
		const reactiveStore = new ReactiveStore('Lorem-Store');
		const store = ref(reactiveStore.getStore());
		onUnmounted(() => reactiveStore.destroy());

		reactiveStore.addTarget('draft', 'drafts', {});
		reactiveStore.updateSubscription('draft', {_id: props.draftId});

		const isDisabled = (fieldName) => {
			if (store.value.draft) {
				let meta = store.value.draft.meta;
				if (meta) {
					let field = _.get(meta, fieldName);
					if (field) {
						let user = _.get(field, 'user');
						return user !== Auth.userAttribute('_id');
					}
				}
			}
			return false;
		};

		const isDraft = computed(() => !_.isEmpty(_.get(store, 'value.draft')));

		watch(isDraft, async (value) => {
			if (value !== true) await router.push('/');
		});

		return {
			store,

			notLoaded: () => !_.get(store.value, 'draft.document', false),

			SPECIES: ['Human', 'Draenei', 'Dryad', 'Dwarf', 'Gnome', 'Worgde'],

			isDraft,
			isDisabled,

			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),

			onFocus: (field) => {
				if (isDisabled(field)) return;

				return sendMutationQuery('draftFocus', {
					draftId: store.value.draft._id,
					field
				});
			},

			onBlur: (field) => {
				return sendMutationQuery('draftBlur', {
					draftId: store.value.draft._id,
					field
				});
			},

			onChange: _.throttle(
				function ({target: {name: field, value}}) {
					_.set(store.value.draft.document, field, value);
					return sendMutationQuery('draftChange', {
						draftId: store.value.draft._id,
						change: {value, field}
					});
				},
				250,
				{leading: true}
			),

			closeDialog: async () => {
				const completed = await sendMutationQuery('draftCancel', {
					draftId: store.value.draft._id
				});
				if (completed) await router.push('/');
				else console.error(' - closeDialog response', completed); // oops...
			},

			saveLorem: async () => {
				const completed = await sendMutationQuery('draftSave', {
					draftId: store.value.draft._id
				});
				if (completed) await router.push('/');
				else console.error(' - saveLorem response', completed); // oops...
			}
		};
	}
};
