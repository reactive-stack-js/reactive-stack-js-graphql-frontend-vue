import {createApp} from "vue";
import Vuex from "vuex";
import SemanticUIVue from "semantic-ui-vue";

import router from "./router";
import App from "./app/App.vue";

createApp(App)
	.use(router)
	.use(Vuex)
	.use(SemanticUIVue)
	.mount("#vue-app");

// TODO: remove
// fetch("//localhost:3007/graphql", {
// 	method: "POST",
// 	headers: AuthService.getAuthHeader(),
// 	body: JSON.stringify({
// 		query: "{ user(id: "5f5a304a10f01d00f802af65") {_id name provider} }"
// 	})
// })
// 	.then(r => r.json())
// 	.then(data => console.log(" - graphql data returned:", JSON.stringify(data)));
