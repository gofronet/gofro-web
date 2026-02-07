import ApiService from '$lib/server/data/services/api.service.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiService = new ApiService(fetch);
	const nodes = await apiService.getAllNodes();

	return { nodes };
};

export const actions: Actions = {
	addNode: async ({ request, fetch }) => {
		const formData = await request.formData();
		const nodeAddress = formData.get('node_address');

		if (typeof nodeAddress !== 'string' || !nodeAddress.trim()) {
			return fail(400, { error: 'node_address_required' });
		}

		const apiService = new ApiService(fetch);
		const node = await apiService.addNode({ node_address: nodeAddress.trim() });

		return { node };
	},
	getNodeConfig: async ({ request, fetch }) => {
		const formData = await request.formData();
		const nodeName = formData.get('node_name');

		if (typeof nodeName !== 'string' || !nodeName.trim()) {
			return fail(400, { error: 'node_name_required' });
		}

		const apiService = new ApiService(fetch);
		const response = await apiService.getCurrentNodeConfig({ node_name: nodeName.trim() });

		return { nodeName: response.node_name, config: response.current_config };
	},
	updateNodeConfig: async ({ request, fetch }) => {
		const formData = await request.formData();
		const nodeName = formData.get('node_name');
		const newConfig = formData.get('new_config');

		if (typeof nodeName !== 'string' || !nodeName.trim()) {
			return fail(400, { error: 'node_name_required' });
		}

		if (typeof newConfig !== 'string') {
			return fail(400, { error: 'config_required' });
		}

		const apiService = new ApiService(fetch);
		await apiService.updateNodeConfig({
			node_name: nodeName.trim(),
			new_config: newConfig
		});

		return { success: true };
	}
};
