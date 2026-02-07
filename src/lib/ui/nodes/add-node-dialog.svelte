<script lang="ts">
	import Icon from '@iconify/svelte';

	let {
		open,
		onClose,
		onAdded
	}: {
		open: boolean;
		onClose: () => void;
		onAdded: (node: { node_name: string; is_xray_running: boolean }) => void;
	} = $props();

	let address = $state('');
	let loading = $state(false);

	const handleAdd = async () => {
		if (loading) return;
		if (!address.trim()) return;

		loading = true;
		const formData = new FormData();
		formData.set('node_address', address.trim());

		try {
			const response = await fetch('?/addNode', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) return;

			const result = await response.json();
			const node = result?.data?.node ?? result?.node;

			if (node?.node_name) {
				onAdded(node);
				address = '';
				onClose();
			}
		} finally {
			loading = false;
		}
	};
</script>

{#if open}
	<button
		type="button"
		aria-label="Close dialog"
		class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
		onclick={onClose}
	></button>
	<div class="fixed inset-0 z-50 flex items-center justify-center px-4">
		<div
			class="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-100"
			role="dialog"
			aria-modal="true"
		>
			<h2 class="text-sm font-semibold tracking-[0.25em] text-zinc-400 uppercase">Add Node</h2>
			<p class="mt-2 text-sm text-zinc-300">Введите адрес сервера</p>
			<input
				type="text"
				placeholder="например, 10.0.0.12:8443"
				class="mt-3 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none"
				bind:value={address}
			/>
			<div class="mt-5 flex items-center justify-end gap-2">
				<button
					type="button"
					class="rounded-md border border-zinc-800 px-3 py-2 text-xs font-semibold tracking-[0.22em] text-zinc-200 uppercase transition hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={loading}
					onclick={onClose}
				>
					Cancel
				</button>
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-md border border-emerald-600/60 bg-emerald-500/10 px-3 py-2 text-xs font-semibold tracking-[0.22em] text-emerald-200 uppercase transition hover:border-emerald-500 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
					disabled={loading || !address?.trim()}
					onclick={handleAdd}
				>
					{#if loading}
						<Icon icon="line-md:loading-twotone-loop" width="16" height="16" />
					{/if}
					Add
				</button>
			</div>
		</div>
	</div>
{/if}
