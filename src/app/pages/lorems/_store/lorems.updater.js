import _ from "lodash";

import AUpdater from "@/_reactivestack/_a.updater";
import loremsStore from "./lorems.store";
import ClientSocket from "@/_reactivestack/client.socket";
import orSearchFactory from "@/_reactivestack/_f.or.search.factory";

const _initialConfig = () => ({
	page: 1,
	pageSize: 10,
	search: "",
	sort: {createdAt: -1}
});

const COLUMNS = {
	firstname: 'string',
	lastname: 'string',
	email: 'string',
	description: 'string',
	rating: 'number',
	iteration: 'number'
}

export default class LoremsUpdater extends AUpdater {

	constructor() {
		super("LoremsUpdater");
		this._path = ["lorems", "selected", "selectedVersions"];
		this.setConfig(_initialConfig());
	}

	_process(message) {
		let {path, payload} = message;

		switch (path) {
			case "lorems":
				loremsStore.setLorems(payload.lorems);
				loremsStore.setLoremsTotalCount(payload._loremsCount);
				break;

			case "selected":
				loremsStore.setSelectedLorem(payload.selected);
				break;

			case "selectedVersions":
				loremsStore.setSelectedLoremVersions(payload.selectedVersions);
				break;

			default:
				break;
		}
	}

	setConfig(config) {
		this._config = config || _initialConfig();
		let {search, sort, page, pageSize} = this._config;

		let query = {isLatest: true};
		if (!_.isEmpty(search)) {
			query = {
				isLatest: true,
				$or: orSearchFactory(search, COLUMNS)
			};
		}

		ClientSocket.sendSubscribe({
			target: "lorems",
			observe: "lorems",
			scope: "many",
			config: {query, sort, page, pageSize}
		});
	}

	unselect() {
		if (_.isEmpty(loremsStore.selectedLorem)) return;
		loremsStore.setSelectedLorem({});
		loremsStore.setSelectedLoremVersions([]);

		ClientSocket.sendUnsubscribe({target: "selected"});
		ClientSocket.sendUnsubscribe({target: "selectedVersions"});
	}

	select(lorem) {
		loremsStore.setSelectedLorem(lorem);		// optimistic update
		loremsStore.setSelectedLoremVersions([]);	// cleanup

		ClientSocket.sendSubscribe({
			target: "selected",
			observe: "lorems",
			scope: "one",
			config: {
				query: {
					itemId: lorem.itemId,
					isLatest: true
				}
			}
		});

		ClientSocket.sendSubscribe({
			target: "selectedVersions",
			observe: "lorems",
			scope: "many",
			config: {
				query: {
					itemId: lorem.itemId
				},
				sort: {iteration: -1}
			}
		});
	}

}
