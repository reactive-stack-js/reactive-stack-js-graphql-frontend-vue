import {ref} from 'vue';

import moment from "moment";
import {jsonToGraphQLQuery} from 'json-to-graphql-query';

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

import Versions from './versions/Versions.vue';
import {loremsStore} from "../_store/lorems.store";

const VUE_APP_GRAPHQL_PATH = process.env.VUE_APP_GRAPHQL_PATH;

export default {
	name: 'Preview',
	components: {
		Versions
	},

	setup() {
		let store = ref(loremsStore);

		return {
			store,

			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),
			editLorem: async () => {
				const createDraftMutation = jsonToGraphQLQuery({
					mutation: {
						draftCreate: {
							__args: {
								collectionName: "lorems",
								sourceDocumentId: store.value.selectedLorem._id,
								userId: AuthService.user().id
							},
							_id: true
						}
					}
				}, {pretty: true});

				const response = await fetch(VUE_APP_GRAPHQL_PATH, {
					method: 'POST',
					headers: AuthService.getAuthHeader(),
					body: JSON.stringify({query: createDraftMutation})
				});
				const jsonResponse = await response.json();
				const {data: {draftCreate: {_id: draftId}}} = jsonResponse;
				router.push('/lorem/' + draftId);
			}
		}
	}
}
