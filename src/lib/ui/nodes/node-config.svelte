<script lang="ts">
	import Icon from '@iconify/svelte';

	let { selectedNodeName }: { selectedNodeName: string | null } = $props();

	let value = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let isRefreshing = $state(false);

	const parseConfigResponse = (result: any, fallbackName: string) => {
		let data: unknown = result?.data ?? result;

		if (typeof data === 'string') {
			try {
				data = JSON.parse(data);
			} catch {
				data = { config: data };
			}
		}

		if (Array.isArray(data)) {
			const [, name, config] = data;
			data = { nodeName: name, config };
		}

		const rawConfig =
			(data as any)?.config ??
			(data as any)?.current_config ??
			(data as any)?.currentConfig ??
			(data as any)?.nodeConfig;
		const rawName =
			(data as any)?.nodeName ?? (data as any)?.node_name ?? (data as any)?.name ?? fallbackName;

		return { rawConfig, rawName, rawError: (data as any)?.error };
	};

	const loadConfig = async (nodeName: string, signal?: AbortSignal) => {
		isLoading = true;
		error = null;
		value = '';

		const formData = new FormData();
		formData.set('node_name', nodeName);

		try {
			const response = await fetch('?/getNodeConfig', {
				method: 'POST',
				body: formData,
				signal
			});

			if (!response.ok) {
				error = 'failed_to_load_config';
				return;
			}

			const result = await response.json();
			const { rawConfig, rawError } = parseConfigResponse(result, nodeName);

			if (rawConfig !== undefined) {
				value =
					typeof rawConfig === 'string' ? rawConfig : JSON.stringify(rawConfig ?? '', null, 2);
				return;
			}

			error = rawError ?? 'failed_to_load_config';
		} catch (err) {
			if ((err as Error)?.name !== 'AbortError') {
				error = 'failed_to_load_config';
			}
		} finally {
			isLoading = false;
		}
	};

	const updateConfig = async () => {
		if (!selectedNodeName || isRefreshing) return;
		isRefreshing = true;
		error = null;

		const formData = new FormData();
		formData.set('node_name', selectedNodeName);
		formData.set('new_config', value);

		try {
			const response = await fetch('?/updateNodeConfig', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				error = 'failed_to_update_config';
			}
		} catch {
			error = 'failed_to_update_config';
		} finally {
			isRefreshing = false;
		}
	};

	$effect(() => {
		if (!selectedNodeName) {
			value = '';
			error = null;
			isLoading = false;
			return;
		}

		const controller = new AbortController();
		loadConfig(selectedNodeName, controller.signal);

		return () => controller.abort();
	});
</script>

<div class="max-h-screen w-full">
	<div class="flex flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-3">
		{#if !selectedNodeName}
			<div
				class="flex h-[calc((100vh-10rem))] flex-col items-center justify-center gap-3 text-center"
			>
				<Icon icon="line-md:upload-outline-loop" width="28" height="28" class="text-zinc-400" />
				<p class="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase">
					Select a node to view its config
				</p>
			</div>
		{:else if isLoading}
			<div
				class="flex h-[calc((100vh-10rem))] flex-col items-center justify-center gap-3 text-center"
			>
				<Icon icon="line-md:loading-twotone-loop" width="28" height="28" class="text-emerald-300" />
				<p class="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase">Loading config</p>
			</div>
		{:else if error}
			<p class="mt-3 text-sm text-rose-400">Failed to load config.</p>
		{:else}
			<div class="flex items-center justify-between gap-3">
				<p class="text-xs font-semibold tracking-[0.3em] text-zinc-400 uppercase">
					Config <span class="text-zinc-500">/</span>
					<span class="text-zinc-200">{selectedNodeName}</span>
				</p>
				<button
					type="button"
					class="group flex gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-zinc-200 uppercase transition hover:border-zinc-700 hover:bg-zinc-800"
					onclick={updateConfig}
					disabled={isRefreshing}
				>
					{#if isRefreshing}
						<Icon icon="line-md:loading-twotone-loop" width="16" height="16" />
					{:else}
						<Icon icon="line-md:pencil" width="16" height="16" class="pencil-icon" />
					{/if}
					Apply config
				</button>
			</div>
			{#key selectedNodeName}
				<textarea
					class="mt-3 h-[calc((100vh-10rem))] w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-100 transition outline-none"
					spellcheck="false"
					bind:value
				></textarea>
			{/key}
		{/if}
	</div>
</div>
