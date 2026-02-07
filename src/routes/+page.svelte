<script lang="ts">
	import type XrayNode from '$lib/domain/models/node';
	import { NodesPanel } from '$lib/ui/nodes';
	import type { PageProps } from './$types';

	let data: PageProps = $props();

	const nodes = $derived(
		data.data.nodes.map(
			(node) => ({ xrayRunning: node.is_xray_running, name: node.node_name }) satisfies XrayNode
		)
	);
</script>

<div class="min-h-screen px-4 py-6">
	<NodesPanel initialNodes={nodes} />
</div>
