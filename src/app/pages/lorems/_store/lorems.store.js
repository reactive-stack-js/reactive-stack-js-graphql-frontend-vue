import _ from "lodash";
import {reactive} from "vue";
import ClientSocket from "@/_reactivestack/client.socket";

const loremsStore = {
	lorems: [],
	loremsCount: 0,
	loremsTotalCount: 0,
	selectedLorem: {},
	selectedLoremVersions: [],

	reset() {
		this.lorems = [];
		this.loremsCount = 0;
		this.loremsTotalCount = 0;
		this.selectedLorem = {};
		this.selectedLoremVersions = [];
	},

	isSelected(lorem) {
		return _.get(lorem, '_id', 1) === _.get(this.selectedLorem, '_id', 2);
	},

	getVersions() {		// this is weird, but... apparently when empty it returns {0: undefined}
		return _.isEmpty(this.selectedLoremVersions[0])
			? []
			: this.selectedLoremVersions;
	},

	setLorems(lorems) {
		this.lorems = _.concat([], lorems);
		this.loremsCount = _.size(lorems);
	},

	setLoremsTotalCount(count) {
		this.loremsTotalCount = count;
	},

	setSelectedLorem(selected) {
		this.selectedLorem = selected;
	},

	setSelectedLoremVersions(versions) {
		this.selectedLoremVersions = _.concat([], versions);
	},

	pick(lorem) {
		this.selectedLorem = lorem;

		ClientSocket.sendSubscribe({
			target: "selected",
			observe: "lorems",
			scope: "one",
			config: {query: {_id: lorem._id}}
		});
	}
}
export default reactive(loremsStore);
