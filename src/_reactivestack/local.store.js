import ReactiveStore from "@/_reactivestack/reactive.store";
import ClientSocket from "@/_reactivestack/client.socket";

export default class LocalStore {
	static _instance;

	static sendSubscribe(target, config) {
		LocalStore._instance.sendSubscribe(target, config);
	}

	static sendUnsubscribe(target) {
		LocalStore._instance.sendUnsubscribe(target);
	}

	static async init(targets) {
		if (!LocalStore._instance) LocalStore._instance = new ReactiveStore();
		await LocalStore._instance.init(targets);
		return LocalStore._instance;
	}

	static getStore() {
		return LocalStore._instance.getStore();
	}

	static destroy() {
		LocalStore._instance.destroy();
		console.log("LocalStore destroyed.");
	}
}
