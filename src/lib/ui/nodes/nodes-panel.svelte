<script lang="ts">
	import type XrayNode from '$lib/domain/models/node';
	import AddNodeDialog from '$lib/ui/nodes/add-node-dialog.svelte';
	import Node from '$lib/ui/nodes/node.svelte';
	import NodeConfig from '$lib/ui/nodes/node-config.svelte';

	let { initialNodes }: { initialNodes: XrayNode[] } = $props();

	let nodes = $derived<XrayNode[]>(initialNodes);
	let selectedNodeName = $state<string | null>(null);
	let showAddNode = $state(false);

	const handleNodeAdded = (node: { node_name: string; is_xray_running: boolean }) => {
		const mapped = { name: node.node_name, xrayRunning: node.is_xray_running } satisfies XrayNode;
		nodes = [mapped, ...nodes.filter((item) => item.name !== mapped.name)];
		selectedNodeName = mapped.name;
	};
</script>

<div class="flex min-h-screen gap-6">
	<div class="w-72 shrink-0">
		<div class="mb-6">
			<div class="text-xl font-semibold tracking-[0.4em] text-zinc-100 uppercase">
				<span class="text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]">
					GOFRONET
				</span>
				<span class="text-zinc-400"> PANEL</span>
			</div>
			<div class="mt-1 h-px w-16 bg-linear-to-r from-emerald-400/60 to-transparent"></div>
		</div>
		<div class="mb-4 flex items-center justify-between gap-4">
			<p class="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase">Nodes</p>
			<button
				type="button"
				class="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold tracking-[0.22em] text-zinc-200 uppercase transition hover:border-zinc-700 hover:bg-zinc-800"
				onclick={() => {
					showAddNode = true;
				}}
			>
				<span class="hidden sm:inline">Add Node</span>
			</button>
		</div>
		<div class="flex flex-col gap-3">
			{#each nodes as node}
				<Node
					{node}
					selected={selectedNodeName === node.name}
					onClick={() => (selectedNodeName = node.name)}
				/>
			{/each}
		</div>
	</div>
	<NodeConfig {selectedNodeName} />
</div>

<AddNodeDialog open={showAddNode} onClose={() => (showAddNode = false)} onAdded={handleNodeAdded} />
