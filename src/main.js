import {createApp} from 'vue';
import Vuex from 'vuex'
import SemanticUIVue from 'semantic-ui-vue';

import router from './router'
import App from './app/App.vue'
import AuthService from "@/_reactivestack/auth.service";

createApp(App)
	.use(router)
	.use(Vuex)
	.use(SemanticUIVue)
	.mount('#vue-app');

// TODO: remove
fetch('//localhost:3007/graphql', {
	method: 'POST',
	headers: AuthService.getAuthHeader(),
	body: JSON.stringify({
		query: '{ user(id: "5f5a304a10f01d00f802af65") {_id name provider} }'
	})
})
	.then(r => r.json())
	.then(data => console.log(' - graphql data returned:', JSON.stringify(data)));

// import {createApolloFetch}  from 'apollo-fetch';
// const fetch = createApolloFetch({uri: 'http://localhost:3007/graphql'});
// fetch({query: '{ lorem(id: "5f5f498eb312715040bd3c62") {name, itemId} }'}).then(res => console.log(res.data));
//
// fetch({
// 	query: `query {
//     lorems(page: $page, pageSize: $pageSize, filter:$filter) {
// 		_id
// 		itemId
// 		name
// 		isLatest
// 	}
//   }`,
// 	variables: {page: 1, pageSize: 5, filter: {firstname: "Mona", isLatest: true}},
// })
// 	.then(res => console.log(res.data));