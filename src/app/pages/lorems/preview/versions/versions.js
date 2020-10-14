import {ref} from "vue";

import moment from "moment";

import loremsStore from "@/app/pages/lorems/_store/lorems.store";

export default {
	name: "PreviewVersions",
	setup() {
		let store = ref(loremsStore);
		return {
			store,
			getVersions: () => store.value.getVersions(),
			getRowClass: (lorem) => store.value.isSelected(lorem) ? "active" : "",
			momentDate: (date) => moment(date).format("YYYY/MM/DD HH:mm:ss"),
			selectRow: (lorem) => store.value.pick(lorem)
		}
	}
}
