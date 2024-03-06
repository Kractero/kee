<script lang="ts">
	import { badges } from '$lib/badges';
	import { cardcategory } from '$lib/cardcategory';
	import { category } from '$lib/category';
	import { flags } from '$lib/flags';
	import { buildCards } from '$lib/helpers/buildCards';

	import { parameters } from '$lib/parameters';
	import { trophies } from '$lib/trophies';
	import type { Clause } from '$lib/types';
	import S1S2Card from '../components/S1S2Card.svelte';
	import S3Card from '../components/S3Card.svelte';

	let clauses: Array<Clause> = [
		{
			qualifier: '',
			whereValue: 'name',
			conditionValue: 'IS',
			badgeTrophyValue: '',
			input: 'Kractero',
			trophyPercentage: ''
		}
	];
	let qualifier = 'AND';
	let selectValue = 'S3';
	let queryWhereValue = '*';
	let returnedItems: any[] = [];
	let ua: string = '';
	let decks: string = '';
	let collections: string = '';
	let bids: string = '';

	function removeClause(index: number) {
		clauses = [...clauses.slice(0, index), ...clauses.slice(index + 1)];
	}

	function addClause() {
		clauses = [
			...clauses,
			{
				qualifier: qualifier,
				whereValue: '',
				conditionValue: '',
				badgeTrophyValue: '',
				input: '',
				trophyPercentage: ''
			}
		];
	}

	async function buildQuery(event: Event) {
		event.preventDefault();

		let cardsToPass: Array<{ CARDID: number; SEASON: number }> = [];
		if (decks || collections || bids) {
			cardsToPass = await buildCards(
				ua,
				collections.split(',') || [],
				decks.split(',') || [],
				bids.split(',') || []
			);
		}

		const queyr = {
			mainWhereValue: queryWhereValue,
			table: selectValue,
			clauses: clauses,
			cards: cardsToPass
		};

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: queyr })
		};

		try {
			const response = await fetch('http://localhost:3000/ui', requestOptions);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			let data = await response.json();

			if (cardsToPass) {
				data = data.filter((card: { CARDID: number; SEASON: number }) => {
					return !cardsToPass.some(
						(collectionCard) =>
							collectionCard.CARDID === card.CARDID && collectionCard.SEASON === card.SEASON
					);
				});
			}

			returnedItems = data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<form on:submit={buildQuery} class="flex flex-col items-center gap-4">
	<div class="flex gap-2 items-center">
		<p>SELECT</p>
		<select
			class="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
			bind:value={queryWhereValue}
		>
			<option>*</option>
			<option>id, name, season</option>
		</select>
		<p>FROM</p>
		<select
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
			bind:value={selectValue}
		>
			<option>S1</option>
			<option>S2</option>
			<option>S3</option>
		</select>
	</div>

	<div class="items-center flex gap-2 w-80">
		<p>Add new</p>
		<select
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
			bind:value={qualifier}><option>AND</option><option>OR</option></select
		>
		clause
		<button class="p-2 bg-blue-400 rounded-md w-18 m-auto" type="button" on:click={addClause}
			>+</button
		>
	</div>
	<p>WHERE</p>
	{#each clauses as clause, i}
		<div class="flex gap-2">
			<button
				class="p-2 bg-red-400 rounded-md w-18 m-auto"
				type="button"
				on:click={() => removeClause(i)}>X</button
			>
			{#if clause.qualifier}
				<p>{clause.qualifier}</p>
			{/if}
			<select
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
				bind:value={clause.whereValue}
			>
				{#each selectValue === 'S1' ? parameters : parameters.filter((param) => param !== 'exnation') as parameter}
					<option>{parameter}</option>
				{/each}
			</select>
			{#if clause.whereValue !== 'exnation'}
				{#if ['badges', 'trophies'].includes(clause.whereValue)}
					<p>JSON_EXTRACT {clause.whereValue}</p>
					<select
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
						bind:value={clause.conditionValue}
					>
						<option>IS</option>
						<option>IS NOT</option>
						<option>HAS NO</option>
					</select>
					{#if clause.conditionValue !== 'HAS NO'}
						{#if clause.whereValue === 'badges'}
							<select
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
								bind:value={clause.badgeTrophyValue}
							>
								{#each badges as badge}
									<option>{badge}</option>
								{/each}
							</select>
						{/if}
						{#if clause.whereValue === 'trophies'}
							<select
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
								bind:value={clause.badgeTrophyValue}
							>
								{#each trophies as trophy}
									<option>{trophy}</option>
								{/each}
							</select>
							<select
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
								bind:value={clause.trophyPercentage}
							>
								{#each ['1T', '1', '5', '10'] as trophy}
									<option>{trophy}</option>
								{/each}
							</select>
						{/if}
					{:else}
						<p>badges</p>
					{/if}
				{/if}
				{#if !['badges', 'trophies'].includes(clause.whereValue)}
					<select
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
						bind:value={clause.conditionValue}
					>
						{#if clause.whereValue !== 'flag'}
							<option>IS</option>
							<option>IS NOT</option>
						{/if}
						{#if !['cardcategory', 'category'].includes(clause.whereValue)}
							<option>LIKE</option>
							<option>NOT LIKE</option>
						{/if}
					</select>
					{#if clause.whereValue === 'flag'}
						<select
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
							bind:value={clause.input}
						>
							{#each flags as flag}
								<option>{flag}</option>
							{/each}
						</select>
					{:else if clause.whereValue === 'cardcategory'}
						<select
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
							bind:value={clause.input}
						>
							{#each cardcategory as rarity}
								<option>{rarity}</option>
							{/each}
						</select>
					{:else if clause.whereValue === 'category'}
						<select
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
							bind:value={clause.input}
						>
							{#each category as government}
								<option>{government}</option>
							{/each}
						</select>
					{:else}
						<input
							class="max-w-36 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
							bind:value={clause.input}
						/>
					{/if}
				{/if}
			{/if}
		</div>
	{/each}
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
	<div class="w-80 text-left items-center flex gap-2 justify-between">
		<label for="bids">Bids</label>
		<input
			id="bids"
			name="bids"
			class="max-w-48 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
			bind:value={bids}
		/>
	</div>
	<button class="p-2 bg-blue-400 rounded-md w-36 m-auto" type="submit">Compute</button>
</form>

{#if returnedItems[0] && returnedItems[0].cardcategory}
	{#each returnedItems as card}
		{#if card.season !== 3}
			<S1S2Card {card} />
		{:else}
			<S3Card {card} />
		{/if}
	{/each}
{:else}
	<div class="flex flex-col dark:text-white">
		{#each returnedItems as card}
			<a href={`https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}`}>
				{card.season}
				{card.name}
			</a>
		{/each}
	</div>
{/if}