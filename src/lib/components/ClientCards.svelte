<script lang="ts">
	export let ua: string;
	export let decks: string;
	export let collections: string;
	export let bids: string;
</script>

<p class="w-80 text-center">
	This will pipe the output of the query against either the specified nation's deck/bids or the
	combined sum of the collections
</p>
<div class="w-80 text-left items-center flex gap-2 justify-between">
	<label for="ua">User Agent</label>
	<input
		id="ua"
		name="ua"
		class="max-w-36 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
		bind:value={ua}
		required={decks || collections || bids ? true : false}
	/>
</div>
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
