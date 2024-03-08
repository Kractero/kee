<script lang="ts">
	import { badges } from '$lib/badges';
	import { cardcategory } from '$lib/cardcategory';
	import { category } from '$lib/category';
	import { flags } from '$lib/flags';
	import { buildCards } from '$lib/helpers/buildCards';
	import { parameters } from '$lib/parameters';
	import { trophies } from '$lib/trophies';
	import type { Card, Clause } from '$lib/types';
	import S1S2Card from '../components/S1S2Card.svelte';
	import S3Card from '../components/S3Card.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { pushHistory } from '$lib/helpers/pushHistory';
	import { onMount } from 'svelte';

	let showClient = false;
	import { downloadCSV } from '$lib/helpers/download';
	import PreviousQueries from '../components/PreviousQueries.svelte';
	import Pagination from '../components/Pagination.svelte';
	import GenericSelect from '../components/GenericSelect.svelte';
	import ClientCards from '../components/ClientCards.svelte';
	import { emptyClause } from '$lib/emptyClause';
	import Head from '../components/Head.svelte';
	import { page } from '$app/stores';

	let clauses: Array<Clause> = [emptyClause("")];
	let qualifier = 'AND';
	let selectValue = 'S3';
	let queryWhereValue = '*';
	let returnedItems: Card[] = [];
	let ua: string = '';
	let decks: string = '';
	let collections: string = '';
	let bids: string = '';
	let currentPage = 1;
	let clauseHistory: string[] = [];
	let errorMessage = "";
	let clauseAsString: any[];

	onMount(() => {
		queryWhereValue = $page.url.searchParams.get('select') === "all" ? "*" : $page.url.searchParams.get('select') === "min" ? "id, name, season" : "*";
		selectValue = $page.url.searchParams.get('from') || "S3";
		const testBuildClauses = $page.url.searchParams.get('clauses') !== "" ? $page.url.searchParams.get('clauses')!.split(',').map((clause: string) => {
			const clauser = clause.split('-')
			return {
				qualifier: ['OR', 'AND'].includes(clauser[0]) ? clauser[0] : "",
				whereValue: ['OR', 'AND'].includes(clauser[0]) ? clauser[1] : clauser[0],
				conditionValue: ['OR', 'AND'].includes(clauser[0]) ? clauser[2] : clauser[1],
				badgeTrophyValue: "",
				input: ['OR', 'AND'].includes(clauser[0]) ? clauser[3] : clauser[2],
				trophyPercentage: ['OR', 'AND'].includes(clauser[0]) ? clauser[4] ? clauser[4] : "" : clauser[3] ? clauser[3] : "",
			}
		}) : []
		clauses = testBuildClauses.length > 0 ? [...testBuildClauses] : [emptyClause("")]
		clauseHistory = localStorage.getItem("clauses") ? JSON.parse(localStorage.getItem("clauses")!) : [];
	})

	async function buildQuery(event: Event) {
		event.preventDefault();
		errorMessage = "";
		clauseAsString = clauses.map((clause, i) => {
			return `${clause.qualifier}${i > 0 ? '-' : ""}${clause.whereValue}-${clause.conditionValue}-${clause.input}${clause.trophyPercentage && `-${clause.trophyPercentage}`}`
		})
		pushHistory(`?select=${queryWhereValue === "*" ? "all" : "min"}&from=${selectValue}&clauses=${clauseAsString.join(',')}`)
		if (localStorage.getItem('clauses') !== null) {
			const newClauseString = `?select=${queryWhereValue === "*" ? "all" : "min"}&from=${selectValue}&clauses=${clauseAsString.join(',')}`;
			if (!clauseHistory.includes(newClauseString)) {
					clauseHistory = [...clauseHistory, newClauseString]
			}
			localStorage.setItem('clauses', JSON.stringify(clauseHistory))
		} else {
			clauseHistory = [`?select=${queryWhereValue === "*" ? "all" : "min"}&from=${selectValue}&clauses=${clauseAsString.join(',')}`]
			localStorage.setItem('clauses', JSON.stringify(clauseHistory))
		}
		let cardsToPass: Array<{ CARDID: number; SEASON: number }> = [];
		if (decks || collections || bids) {
			cardsToPass = await buildCards(
				ua,
				collections.split(',') || [],
				decks.split(',') || [],
				bids.split(',') || []
			);
		}

		try {
			const response = await fetch(`${PUBLIC_API_URL}/api?select=${queryWhereValue === "*" ? "all" : "min"}&from=${selectValue}&clauses=${clauseAsString.join(',')}`);

			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

			let data = await response.json();

			if (cardsToPass) {
				data = data.filter((card: { id: number; season: number }) => {
					return !cardsToPass.some(
						(collectionCard) =>
							collectionCard.CARDID === card.id && collectionCard.SEASON === card.season
					);
				});
			}

			returnedItems = data;
		} catch (error: unknown) {
			console.error('Error:', error);
			if (error instanceof Error) {
				errorMessage = "An error occured: with " + error.message;
			}
		}
	}
	$: lastPostIndex = currentPage * 25;
	$: firstPostIndex = lastPostIndex - 25;
	$: currentCards = returnedItems.slice(firstPostIndex, lastPostIndex);
</script>

<Head title={`Queries`} description={"Query cards from the NationStates card game"} />

<form on:submit={buildQuery} class="flex flex-col items-center gap-4 mb-8">
	<div class="flex gap-2 items-center">
		<p>SELECT</p>
		<GenericSelect bind:bindValue={queryWhereValue} optionsIterable={['*', 'id, name, season']} />
		<p>FROM</p>
		<GenericSelect bind:bindValue={selectValue} optionsIterable={['S1', 'S2', 'S3']} />
	</div>

	<div class="items-center flex gap-2 w-80">
		<p>Add new</p>
		<select
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-36"
			bind:value={qualifier}><option>AND</option><option>OR</option></select
		>
		clause
		<button class="p-2 bg-blue-400 rounded-md w-18 m-auto" type="button" on:click={() => (clauses = [...clauses, emptyClause(qualifier)])}
			>+</button
		>
	</div>
	<p>WHERE</p>
	{#each clauses as clause, i}
		<div class="flex gap-2 items-center">
			{#if i > 0}
				<button
					class="p-2 bg-red-400 rounded-md w-18 m-auto"
					type="button"
					on:click={() => (clauses = [...clauses.slice(0, i), ...clauses.slice(i + 1)])}>X</button
				>
			{/if}
			{#if clause.qualifier}
				<p class="w-12 text-center">{clause.qualifier}</p>
			{/if}
			<GenericSelect bind:bindValue={clause.whereValue} optionsIterable={selectValue === 'S1' ? parameters : parameters.filter((param) => param !== 'exnation')} />
			{#if clause.whereValue !== 'exnation'}
				{#if ['badges', 'trophies'].includes(clause.whereValue)}
					<p>JSON_EXTRACT {clause.whereValue}</p>
					<GenericSelect bind:bindValue={clause.conditionValue} optionsIterable={['IS', 'IS NOT', 'HAS NO']} />
					{#if clause.conditionValue !== 'HAS NO'}
						{#if clause.whereValue === 'badges'}
							<GenericSelect bind:bindValue={clause.input} optionsIterable={badges} />
						{/if}
						{#if clause.whereValue === 'trophies'}
							<GenericSelect bind:bindValue={clause.input} optionsIterable={trophies} />
							<GenericSelect bind:bindValue={clause.trophyPercentage} optionsIterable={['1T', '1', '5', '10']} />
						{/if}
					{:else}
						<p>badges</p>
					{/if}
				{/if}
				{#if !['badges', 'trophies'].includes(clause.whereValue)}
					<GenericSelect bind:bindValue={clause.conditionValue} optionsIterable={clause.whereValue !== 'flag' && !['cardcategory', 'category'].includes(clause.whereValue) ? ['IS', 'IS NOT', 'LIKE', 'NOT LIKE'] : clause.whereValue === 'flag' ? ['LIKE', 'NOT LIKE'] : ['IS', 'IS NOT']} />
					{#if clause.whereValue === 'flag'}
						<GenericSelect bind:bindValue={clause.input} optionsIterable={flags} />
					{:else if clause.whereValue === 'cardcategory'}
						<GenericSelect bind:bindValue={clause.input} optionsIterable={cardcategory} />
					{:else if clause.whereValue === 'category'}
						<GenericSelect bind:bindValue={clause.input} optionsIterable={category} />
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
		<div class="flex gap-2 my-8">
			<input type="checkbox" id="clientCards" name="clientCards" value={showClient} on:change={() => {
				showClient = !showClient
				if (showClient === false) {
					ua = ""
					decks = ""
					collections = ""
					bids = ""
				}
			}}>
			<label for="clientCards">Check with decks, collections, and bids</label><br>
		</div>
	{#if showClient === true}
		<ClientCards bind:ua={ua} bind:decks={decks} bind:collections={collections} bind:bids={bids} />
	{/if}
	<button data-umami-event="Query computed" class="p-2 bg-blue-400 rounded-md w-36 m-auto" type="submit">Compute</button>
</form>

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}

{#if !errorMessage && returnedItems[0] && returnedItems[0].cardcategory}
<button data-umami-event="Results downloaded" class="mt-8 mb-8 p-2 bg-blue-400 rounded-md w-36 m-auto" on:click={() => downloadCSV(returnedItems, `?select=${queryWhereValue === "*" ? "all" : "min"}&from=${selectValue}&clauses=${clauseAsString.join(',')}.csv`)}>Download</button>
<Pagination bind:currentPage={currentPage} returnedItems={returnedItems} />
	<div class="flex flex-wrap justify-center">
		{#each currentCards as card}
			{#if card.season !== 3}
				<S1S2Card {card} />
			{:else}
				<S3Card {card} />
			{/if}
		{/each}
	</div>
{:else if !errorMessage && returnedItems[0]}
	<Pagination bind:currentPage={currentPage} returnedItems={returnedItems} />
	<button data-umami-event="Results downloaded" class="mt-8 mb-8 p-2 bg-blue-400 rounded-md w-36 m-auto" on:click={() => downloadCSV(returnedItems, `?select=${queryWhereValue === "*" ? "all" : "min"}&from=${selectValue}&clauses=${clauseAsString.join(',')}.csv`)}>Download</button>
	<div class="flex flex-col dark:text-white">
		{#each currentCards as card}
			<a href={`https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}`}>
				{card.season}
				{card.name}
			</a>
		{/each}
	</div>
{/if}

<PreviousQueries bind:clauseHistory={clauseHistory} />