<script lang="ts">
	export let decks: string
	export let collections: string
	export let bids: string
</script>

<div class="w-80 text-left items-center flex gap-2 justify-between">
	<label for="deck">Deck</label>
	<input
		id="deck"
		name="deck"
		class="max-w-48 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
		bind:value={decks}
	/>
</div>
<div class="w-80 text-left items-center flex gap-2 justify-between">
	<label for="collections">Collections</label>
	<input
		id="collections"
		name="collections"
		class="max-w-48 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
		bind:value={collections}
	/>
</div>
<div class="w-80 text-left items-center flex gap-2 justify-between mb-8">
	<label for="bids">Bids</label>
	<input
		id="bids"
		name="bids"
		class="max-w-48 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
		bind:value={bids}
	/>
</div>
