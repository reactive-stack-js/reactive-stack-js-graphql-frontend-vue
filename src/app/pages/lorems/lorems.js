import {ref, onUnmounted} from "vue";

import _ from "lodash";
import moment from "moment";

import AuthService from "@/_reactivestack/auth.service";

import {loremsStore} from "./_store/lorems.store";
import LoremsUpdater from "./_store/lorems.updater";

import Preview from "./preview/Preview.vue";
import Controls from "./controls/Controls.vue";

const _toggleSortingHelper = (sorting, label) => {
	let sortingLabel = _.get(sorting, label, false);
	if (sorting && sortingLabel) {
		if (sortingLabel < 0) _.set(sorting, label, 1);
		else if (sortingLabel > 0) _.set(sorting, label, 0);
		else _.set(sorting, label, -1);
	} else {
		_.set(sorting, label, -1);
	}
	return sorting;
}

let updater;

export default {
	name: "Lorems",
	components: {
		Controls, Preview
	},

	setup() {
		let store = ref(loremsStore);

		let page = ref(1);
		let pageSize = ref(10);
		let search = ref("");
		let sort = ref({createdAt: -1});

		if (AuthService.loggedIn()) {
			if (updater) updater.destroy();
			updater = new LoremsUpdater();
			updater.setConfig();
		}

		onUnmounted(() => {
			store.value.reset();
			if (updater) updater.destroy();
			updater = null;
		});

		const setUpdaterConfig = () => {
			if (updater) {
				updater.setConfig({page: page.value, pageSize: pageSize.value, search: search.value, sort: sort.value});
			}
		};

		return {
			store,
			setUpdaterConfig,
			page, pageSize, search, sort,

			getRowClass: (lorem) => store.value.selectedLorem && lorem.itemId === store.value.selectedLorem.itemId ? "active" : "",
			hasSelected: () => !_.isEmpty(store.value.selectedLorem),
			truncate: (text) => _.truncate(text, {"length": 75, "separator": " "}),
			momentDate: (date) => moment(date).format("YYYY/MM/DD HH:mm:ss"),

			getIcon: (label) => {
				let sortingLabel = sort.value[label];
				if (sortingLabel < 0) return "fa fa-long-arrow-down icon";
				if (sortingLabel > 0) return "fa fa-long-arrow-up icon";
				return "fa fa-blank icon";
			},

			resendConfig: _.throttle(function (controls) {
				if (!updater) return;
				updater.unselect();

				let {page: pageValue, pageSize: pageSizeValue, search: searchValue} = controls;
				page.value = pageValue;
				pageSize.value = pageSizeValue;
				search.value = searchValue;

				setUpdaterConfig();
			}, 100, {"leading": true, "trailing": true}),

			selectRow: (lorem) => {
				if (!_.isEmpty(store.value.selectedLorem) && lorem.itemId === store.value.selectedLorem.itemId) {
					updater.unselect();
				} else {
					updater.select(lorem);
				}
			},

			toggleSorting: (label) => {
				let sorting = _.cloneDeep(sort.value);
				if (label === "firstname") {
					sorting = _toggleSortingHelper(sorting, "firstname");
					sorting = _toggleSortingHelper(sorting, "lastname");
				} else {
					sorting = _toggleSortingHelper(sorting, label);
				}

				if (sorting["createdAt"]) {
					let createdAt = sorting["createdAt"];
					delete sorting["createdAt"];
					sorting["createdAt"] = createdAt;
				}
				sorting = _.pickBy(sorting, _.identity);
				sort.value = sorting;

				setUpdaterConfig();
			}
		};
	}
}
