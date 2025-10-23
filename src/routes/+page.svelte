<script lang="ts">
	import { onMount } from 'svelte'
	import { badges } from '$lib/badges'
	import { cardcategory } from '$lib/cardcategory'
	import { category } from '$lib/category'
	import ClientCards from '$lib/components/ClientCards.svelte'
	import GenericSelect from '$lib/components/GenericSelect.svelte'
	import Head from '$lib/components/Head.svelte'
	import PreviousQueries from '$lib/components/PreviousQueries.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { flags } from '$lib/flags'
	import { parameters } from '$lib/parameters'
	import { trophies } from '$lib/trophies'
	import type { Clause } from '$lib/types'

	let showClient = false
	const emptyClause = {
		qualifier: 'AND',
		whereValue: '',
		conditionValue: 'IS',
		badgeTrophyValue: '',
		input: '',
		trophyPercentage: '',
	}

	let clauses: Array<Clause> = [emptyClause]
	let selectValue = 'S3'
	let queryWhereValue = 'id, name'
	let ua: string = ''
	let decks: string = ''
	let collections: string = ''
	let bids: string = ''
	let clauseHistory: string[] = []

	onMount(async () => {
		clauseHistory = localStorage.getItem('clauses')
			? JSON.parse(localStorage.getItem('clauses')!)
			: []
	})

	$: joinedClauses = clauses
		.map(
			c =>
				`${c.whereValue}-${c.conditionValue}-${c.input}${c.trophyPercentage ? `-${c.trophyPercentage}` : ''}`
		)
		.join(',')
</script>

<Head title={`Queries`} description={'Query cards from the NationStates card game'} />

<form method="GET" action="/query" class="w-[300px] flex flex-col items-center gap-4 mb-8">
	<div class="flex gap-2 items-center w-full">
		<p>SELECT</p>
		<GenericSelect
			bind:bindValue={queryWhereValue}
			name="select"
			optionsIterable={['id, name', '*']}
		/>
		<p>FROM</p>
		<GenericSelect
			bind:bindValue={selectValue}
			name="from"
			optionsIterable={['S1', 'S2', 'S3', 'S4']}
		/>
	</div>

	<div class="items-center flex gap-2 m-auto">
		<p>Add new clause</p>
		<Button type="button" onclick={() => (clauses = [...clauses, emptyClause])}>+</Button>
	</div>
	<p>WHERE</p>
	{#each clauses as clause, i}
		{#if i > 0}
			<p class="w-12 text-center">AND</p>
		{/if}
		<div class="flex gap-2 items-center w-full">
			{#if i > 0}
				<Button
					variant="destructive"
					type="button"
					onclick={() => (clauses = [...clauses.slice(0, i), ...clauses.slice(i + 1)])}>X</Button
				>
			{/if}
			<GenericSelect
				bind:bindValue={clause.whereValue}
				optionsIterable={selectValue === 'S1'
					? parameters
					: parameters.filter(param => param !== 'exnation')}
			/>
			{#if clause.whereValue !== 'exnation'}
				{#if ['badges', 'trophies'].includes(clause.whereValue)}
					<p class="min-w-24 text-center">JSON_EXTRACT {clause.whereValue}</p>
					<GenericSelect
						bind:bindValue={clause.conditionValue}
						optionsIterable={['IS', 'IS NOT', 'HAS NO']}
					/>
					{#if clause.conditionValue !== 'HAS NO'}
						{#if clause.whereValue === 'badges'}
							<GenericSelect bind:bindValue={clause.input} optionsIterable={badges} />
						{/if}
						{#if clause.whereValue === 'trophies'}
							<GenericSelect bind:bindValue={clause.input} optionsIterable={trophies} />
							<GenericSelect
								bind:bindValue={clause.trophyPercentage}
								optionsIterable={['1T', '1', '5', '10']}
							/>
						{/if}
					{:else}
						<p class="min-w-24 text-center">badges</p>
					{/if}
				{/if}
				{#if !['badges', 'trophies'].includes(clause.whereValue)}
					<GenericSelect
						bind:bindValue={clause.conditionValue}
						optionsIterable={clause.whereValue !== 'flag' &&
						!['cardcategory', 'category'].includes(clause.whereValue)
							? ['IS', 'IS NOT', 'LIKE', 'NOT LIKE']
							: clause.whereValue === 'flag'
								? ['LIKE', 'NOT LIKE']
								: ['IS', 'IS NOT']}
					/>
					{#if clause.whereValue === 'flag'}
						<GenericSelect bind:bindValue={clause.input} optionsIterable={flags} />
					{:else if clause.whereValue === 'cardcategory'}
						<GenericSelect bind:bindValue={clause.input} optionsIterable={cardcategory} />
					{:else if clause.whereValue === 'category'}
						<GenericSelect bind:bindValue={clause.input} optionsIterable={category} />
					{:else if clause.whereValue === 'status'}
						<GenericSelect bind:bindValue={clause.input} optionsIterable={['Exists', 'CTE']} />
					{:else}
						<input
							class="max-w-36 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
							bind:value={clause.input}
						/>
					{/if}
				{/if}
			{:else}
				<GenericSelect bind:bindValue={clause.conditionValue} optionsIterable={['IS']} />
				<GenericSelect bind:bindValue={clause.input} optionsIterable={['TRUE', 'FALSE']} />
			{/if}
		</div>
	{/each}
	<input type="hidden" name="clauses" bind:value={joinedClauses} />
	<div class="w-80 text-left items-center flex gap-2 justify-between">
		<label for="ua">User Agent</label>
		<input
			id="ua"
			name="ua"
			class="max-w-36 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
			bind:value={ua}
			required
		/>
	</div>
	<div class="flex gap-2 mt-8">
		<input
			type="checkbox"
			id="clientCards"
			name="clientCards"
			value={showClient}
			on:change={() => {
				showClient = !showClient
				decks = ''
				collections = ''
				bids = ''
			}}
			checked={showClient || (ua !== '' && (decks !== '' || collections !== '' || bids !== ''))}
		/>
		<label for="clientCards">Check with decks, collections, and bids</label><br />
	</div>
	<p class="w-80 text-center">
		This will pass all the cards that match the query against the combined sum of the specified
		nation's deck, bids and combined sum of the collections
	</p>
	{#if showClient === true || (ua !== '' && (decks !== '' || collections !== '' || bids !== '') === true)}
		<ClientCards bind:decks bind:collections bind:bids />
	{/if}
	<div class="space-x-4 mt-8">
		<Button
			disabled={clauses.length === 1 &&
				(clauses[0].whereValue === 'status' || !clauses[0].whereValue)}
			type="submit">Compute</Button
		>
	</div>
</form>

<PreviousQueries bind:clauseHistory />
