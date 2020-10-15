import {ref, computed, watch, onMounted, onUnmounted} from "vue";

import _ from "lodash";
import moment from "moment";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

import sendMutationQuery from "../../../_reactivestack/_f.send.mutation.query";
import LocalStore from "@/_reactivestack/local.store";

export default {
	name: "Lorem",
	props: ["draftId"],

	setup(props) {
		LocalStore.init({
			draft: {
				observe: "drafts",
				initial: {}
			},
		});
		const store = ref(LocalStore.getStore());

		if (AuthService.loggedIn()) {
			LocalStore.sendSubscribe('draft', {_id: props.draftId});
		}

		onMounted(() => {
			console.log('lorem onMounted');
		});

		onUnmounted(() => {
			console.log('lorem onMounted');
		});

		const isDisabled = (fieldName) => {
			if (store.value.draft) {
				let meta = store.value.draft.meta;
				if (meta) {
					let field = _.get(meta, fieldName);
					if (field) {
						let user = _.get(field, "user");
						return user !== AuthService.userId();
					}
				}
			}
			return false;
		};

		const isDraft = computed(() => !_.isEmpty(store.value.draft));

		watch(isDraft, async (value) => {
			if (value !== true) await router.push("/");
		});

		return {
			store,

			notLoaded: () => !_.get(store.value, 'draft.document', false),

			SPECIES: ["Human", "Draenei", "Dryad", "Dwarf", "Gnome", "Worgde"],

			isDraft, isDisabled,

			momentDate: (date) => moment(date).format("YYYY/MM/DD HH:mm:ss"),

			onFocus: (field) => {
				if (isDisabled(field)) return;

				return sendMutationQuery("draftFocus", {
					draftId: store.value.draft._id,
					field
				});
			},

			onBlur: (field) => {
				return sendMutationQuery("draftBlur", {
					draftId: store.value.draft._id,
					field
				});
			},

			onChange: _.throttle(function (e) {
				let {target: {name: field, value}} = e;
				_.set(store.value.draft.document, field, value);

				return sendMutationQuery("draftChange", {
					draftId: store.value.draft._id,
					change: {value, field}
				});
			}, 250, {"leading": true}),

			closeDialog: async () => {
				const completed = await sendMutationQuery("draftCancel", {
					draftId: store.value.draft._id
				});
				if (completed) await router.push("/");
				else console.error(" - closeDialog response", completed);  	// oops...
			},

			saveLorem: async () => {
				const completed = await sendMutationQuery("draftSave", {
					draftId: store.value.draft._id
				});
				if (completed) await router.push("/");
				else console.error(" - saveLorem response", completed);	// oops...
			}
		}
	}
}
