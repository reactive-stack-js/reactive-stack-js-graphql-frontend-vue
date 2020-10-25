import {ref} from 'vue';

import moment from 'moment';

import router from '@/router';
import Versions from './versions/Versions.vue';
import LocalStore from '@/_reactivestack/store/local.store';
import sendMutationQuery from '../../../../_reactivestack/_f.send.mutation.query';

export default {
	name: 'Preview',
	components: {Versions},

	setup() {
		const store = ref(LocalStore.getStore());

		return {
			store,

			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),
			editLorem: async () => {
				const jsonResponse = await sendMutationQuery('draftCreate', {
					collectionName: 'lorems',
					sourceDocumentId: store.value.selectedLorem._id
				});
				const {
					data: {draftCreate: draftId}
				} = jsonResponse;
				await router.push('/lorem/' + draftId);
			}
		};
	}
};
