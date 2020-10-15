import ReactiveStore from "@/_reactivestack/reactive.store";

export default class GlobalStore {
	static _instance;

	static async init(targets) {
		if (!GlobalStore._instance) GlobalStore._instance = new ReactiveStore();
		await GlobalStore._instance.init(targets);
		return GlobalStore._instance;
	}

	static getStore() {
		return GlobalStore._instance.getStore();
	}

	static destroy() {
		GlobalStore._instance.destroy();
		console.log("GlobalStore destroyed.");
	}
}
