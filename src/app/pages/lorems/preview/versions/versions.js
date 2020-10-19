import {ref} from "vue";

import moment from "moment";

import _ from "lodash";
import LocalStore from "@/_reactivestack/store/local.store";

export default {
	name: "PreviewVersions",
	setup() {
		const store = ref(LocalStore.getStore());

		const isSelected = (lorem) => _.get(lorem, '_id', 1) === _.get(store.value.selectedLorem, '_id', 2);

		return {
			store, isSelected,
			getVersions: () => store.value.selectedLoremVersions,
			getRowClass: (lorem) => isSelected(lorem) ? "active" : "",
			momentDate: (date) => moment(date).format("YYYY/MM/DD HH:mm:ss"),
			selectRow: (lorem) => {
				store.value.selectedLorem = lorem;
				LocalStore.sendSubscribe("selectedLorem", {query: {_id: lorem._id}});
			}
		}
	}
}
