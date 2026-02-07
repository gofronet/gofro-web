type NodeInfoResponse = {
	node_name: string;
	is_xray_running: boolean;
};

type AddNodeRequest = {
	node_address: string;
};

type UpdateNodeConfigRequest = {
	node_name: string;
	new_config: string;
};

type GetCurrentNodeConfigRequest = {
	node_name: string;
};

type GetCurrentNodeConfigResponse = {
	node_name: string;
	current_config: string;
};

export {
	NodeInfoResponse,
	AddNodeRequest,
	UpdateNodeConfigRequest,
	GetCurrentNodeConfigRequest,
	GetCurrentNodeConfigResponse
};
