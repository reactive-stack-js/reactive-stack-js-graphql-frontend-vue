import {ref, computed, watch} from 'vue';
import {loremsStore} from "../_store/lorems.store";

export default {
	name: 'Controls',
	emits: ['resend-config'],

	setup(props, context) {
		let page = ref(1);
		let pageSize = ref(10);
		let search = ref('');
		let pageCount = computed(() => parseInt(loremsStore.loremsTotalCount / pageSize.value, 10) + 1);

		const emit = () => context.emit('resend-config', {
			page: page.value,
			pageSize: pageSize.value,
			search: search.value
		});

		watch(page, () => emit());
		watch(pageSize, () => emit());
		watch(search, () => emit());
		watch(pageCount, () => {
			if (page.value > pageCount.value) {
				page.value = pageCount.value;
				emit();
			}
		});

		return {
			MIN_PAGE_SIZE: 5,
			MAX_PAGE_SIZE: 25,
			page, pageSize, search, pageCount, emit,
			pageDec: () => page.value--,
			pageInc: () => page.value++,
			pageSizeDec: () => pageSize.value--,
			pageSizeInc: () => pageSize.value++,
			resetSearch: () => search.value = ''
		};
	}
}
