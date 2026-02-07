<script lang="ts">
	import type XrayNode from '$lib/domain/models/node';
	import Icon from '@iconify/svelte';

	let { node, onClick, selected }: { node: XrayNode; onClick?: () => void; selected?: boolean } =
		$props();

	let isHover = $state(false);
</script>

<div
	class={`relative flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 pl-4 text-zinc-100 transition ${
		selected
			? 'border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'
			: 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-900'
	}`}
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={(event) => {
		if (!onClick) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onClick();
		}
	}}
	onmouseenter={() => (isHover = true)}
	onmouseleave={() => (isHover = false)}
>
	<span
		class={`absolute top-2 bottom-2 left-1 w-0.75 rounded-full transition-all duration-200 ${
			selected ? 'bg-emerald-400 opacity-100' : 'bg-emerald-400 opacity-0'
		}`}
	></span>
	<h1 class="text-sm font-semibold tracking-wide text-zinc-100">
		{node.name}
	</h1>

	{#if node.xrayRunning}
		{#if isHover}
			<Icon
				icon="line-md:hazard-lights-filled-loop"
				width="20"
				height="20"
				class="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
			/>
		{:else}
			<Icon
				icon="line-md:hazard-lights-filled"
				width="20"
				height="20"
				class="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
			/>
		{/if}
	{/if}
</div>
