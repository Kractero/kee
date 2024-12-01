<script lang="ts">
	import { PUBLIC_URL } from '$env/static/public'
	import { Trash } from 'lucide-svelte'

	export let clauseHistory: Array<string>
</script>

{#if clauseHistory.length > 0}
	<h2 class="text-lg font-bold mb-2 text-center mt-24">Previous Queries</h2>
	<div class="flex flex-col gap-4 max-w-xs">
		{#each clauseHistory as clause}
			<div class="flex">
				<button
					on:click={() => {
						clauseHistory = clauseHistory.filter(query => {
							return query !== clause
						})
						localStorage.setItem('clauses', JSON.stringify(clauseHistory))
					}}
				>
					<Trash class="hover:cursor-pointer" />
				</button>
				<a
					target="_self"
					class="min-h-[40px] line-clamp-2 hover:text-purple-700 hover:cursor-pointer flex-1 text-right"
					href={`${PUBLIC_URL}/${clause}`}>{clause}</a
				>
			</div>
		{/each}
	</div>
{/if}
