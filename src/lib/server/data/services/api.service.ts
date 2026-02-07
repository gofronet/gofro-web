import type {
	AddNodeRequest,
	GetCurrentNodeConfigRequest,
	GetCurrentNodeConfigResponse,
	NodeInfoResponse,
	UpdateNodeConfigRequest
} from '../models/node';
import { env } from '$env/dynamic/private';

class ApiService {
	private baseUrl = env.API_BASE_URL;

	constructor(private fetchFn: typeof fetch) {}

	async getAllNodes(): Promise<NodeInfoResponse[]> {
		const response = await this.fetchFn(`${this.baseUrl}/v1/nodes`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Error on getAllNodes request: ${response.statusText}`);
		}

		return response.json();
	}

	async addNode(request: AddNodeRequest): Promise<NodeInfoResponse> {
		const response = await this.fetchFn(`${this.baseUrl}/v1/nodes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		if (!response.ok) {
			throw new Error(`Error on addNode request: ${response.statusText}`);
		}

		return response.json();
	}

	async updateNodeConfig(request: UpdateNodeConfigRequest): Promise<void> {
		const response = await this.fetchFn(`${this.baseUrl}/v1/nodes/update`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		if (!response.ok) {
			throw new Error(`Error on updateNodeConfig request: ${response.statusText}`);
		}
	}

	async getCurrentNodeConfig(
		request: GetCurrentNodeConfigRequest
	): Promise<GetCurrentNodeConfigResponse> {
		const response = await this.fetchFn(`${this.baseUrl}/v1/nodes/config`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(request)
		});

		if (!response.ok) {
			throw new Error(`Error on getCurrentNodeConfig request: ${response.statusText}`);
		}

		return response.json();
	}
}

export default ApiService;
