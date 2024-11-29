<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { PUBLIC_API_URL } from '$env/static/public'
	import { badges } from '$lib/badges'
	import { cardcategory } from '$lib/cardcategory'
	import { category } from '$lib/category'
	import ClientCards from '$lib/components/ClientCards.svelte'
	import GenericSelect from '$lib/components/GenericSelect.svelte'
	import Head from '$lib/components/Head.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import PreviousQueries from '$lib/components/PreviousQueries.svelte'
	import S1S2Card from '$lib/components/S1S2Card.svelte'
	import S3Card from '$lib/components/S3Card.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import * as Popover from '$lib/components/ui/popover'
	import { emptyClause } from '$lib/emptyClause'
	import { flags } from '$lib/flags'
	import { buildCards } from '$lib/helpers/buildCards'
	import { downloadCSV } from '$lib/helpers/download'
	import { htmlContent } from '$lib/helpers/htmlContent'
	import { pushHistory } from '$lib/helpers/pushHistory'
	import { parameters } from '$lib/parameters'
	import { trophies } from '$lib/trophies'
	import type { Card, Clause } from '$lib/types'

	let showClient = false

	let clauses: Array<Clause> = [emptyClause()]
	let selectValue = 'S3'
	let queryWhereValue = '*'
	let returnedItems: Card[] = []
	let ua: string = ''
	let decks: string = ''
	let collections: string = ''
	let bids: string = ''
	let currentPage = 1
	let clauseHistory: string[] = []
	let errorMessage = ''
	let clauseAsString: any[]
	let dlFileName = ''

	onMount(async () => {
		queryWhereValue =
			$page.url.searchParams.has('select') && $page.url.searchParams.get('select') === 'all'
				? '*'
				: $page.url.searchParams.get('select') === 'min'
					? 'id, name, season'
					: '*'
		selectValue = $page.url.searchParams.get('from') || 'S3'
		const testBuildClauses =
			$page.url.searchParams.has('clauses') && $page.url.searchParams.get('clauses') !== null
				? $page.url.searchParams
						.get('clauses')!
						.split(',')
						.map((clause: string) => {
							const clauser = clause.split('-')
							return {
								whereValue: clauser[0] || '',
								conditionValue: clauser[1] || clauser[0],
								input: clauser[2] || clauser[1],
								badgeTrophyValue: '',
								trophyPercentage: clauser[0] === 'trophies' ? clauser[3] : '',
							}
						})
				: []
		clauses = testBuildClauses.length > 0 ? [...testBuildClauses] : [emptyClause()]
		clauseHistory = localStorage.getItem('clauses')
			? JSON.parse(localStorage.getItem('clauses')!)
			: []
		ua =
			$page.url.searchParams.has('ua') && $page.url.searchParams.get('ua') !== null
				? $page.url.searchParams.get('ua')!
				: ''
		decks =
			$page.url.searchParams.has('decks') && $page.url.searchParams.get('decks') !== null
				? $page.url.searchParams.get('decks')!
				: ''
		collections =
			$page.url.searchParams.has('collections') &&
			$page.url.searchParams.get('collections') !== null
				? $page.url.searchParams.get('collections')!
				: ''
		bids =
			$page.url.searchParams.has('bids') && $page.url.searchParams.get('bids') !== null
				? $page.url.searchParams.get('bids')!
				: ''

		// await buildQuery();
	})

	async function buildQuery(event?: Event) {
		if (event) event.preventDefault()
		errorMessage = ''
		clauseAsString = clauses.map((clause, i) => {
			return `${clause.whereValue}-${clause.conditionValue}-${clause.input}${clause.trophyPercentage && `-${clause.trophyPercentage}`}`
		})
		let url = `?select=${queryWhereValue === '*' ? 'all' : 'min'}&from=${selectValue}&clauses=${clauseAsString.join(',')}${ua && `&ua=${ua.split(',')}`}${decks && `&decks=${decks.split(',')}`}${collections && `&collections=${collections.split(',')}`}${bids && `&bids=${bids.split(',')}`}`
		pushHistory(url)
		dlFileName = url
		if (localStorage.getItem('clauses') !== null) {
			if (!clauseHistory.includes(url)) {
				clauseHistory = [...clauseHistory, url]
			}
			localStorage.setItem('clauses', JSON.stringify(clauseHistory))
		} else {
			clauseHistory = [url]
			localStorage.setItem('clauses', JSON.stringify(clauseHistory))
		}
		let cardsToPass: Array<{ CARDID: number; SEASON: number }> = []
		if (decks || collections || bids) {
			cardsToPass = await buildCards(
				ua,
				collections.split(',') || [],
				decks.split(',') || [],
				bids.split(',') || []
			)
		}

		try {
			const response = await fetch(
				`${PUBLIC_API_URL}/api?select=${queryWhereValue === '*' ? 'all' : 'min'}&from=${selectValue}&clauses=${clauseAsString.join(',')}`,
				{
					headers: {
						'X-Origin': 'frontend',
					},
				}
			)

			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

			let data = await response.json()

			if (cardsToPass) {
				data = data.filter((card: { id: number; season: number }) => {
					return !cardsToPass.some(
						collectionCard =>
							collectionCard.CARDID === card.id && collectionCard.SEASON === card.season
					)
				})
			}

			returnedItems = data
		} catch (error: unknown) {
			console.error('Error:', error)
			if (error instanceof Error) {
				errorMessage = 'An error occured: with ' + error.message
			}
		}
	}
	$: lastPostIndex = currentPage * 25
	$: firstPostIndex = lastPostIndex - 25
	$: currentCards = returnedItems.slice(firstPostIndex, lastPostIndex)
</script>

<Head title={`Queries`} description={'Query cards from the NationStates card game'} />

<form on:submit={buildQuery} class="flex flex-col items-center gap-4 mb-8">
	<div class="flex gap-2 items-center">
		<p>SELECT</p>
		<GenericSelect bind:bindValue={queryWhereValue} optionsIterable={['*', 'id, name, season']} />
		<p>FROM</p>
		<GenericSelect bind:bindValue={selectValue} optionsIterable={['S1', 'S2', 'S3']} />
	</div>

	<div class="items-center flex gap-2 m-auto">
		<p>Add new clause</p>
		<Button type="button" on:click={() => (clauses = [...clauses, emptyClause()])}>+</Button>
	</div>
	<p>WHERE</p>
	{#each clauses as clause, i}
		{#if i > 0}
			<p class="w-12 text-center">AND</p>
		{/if}
		<div class="flex gap-2 items-center">
			{#if i > 0}
				<Button
					variant="destructive"
					type="button"
					on:click={() => (clauses = [...clauses.slice(0, i), ...clauses.slice(i + 1)])}>X</Button
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
					<p>JSON_EXTRACT {clause.whereValue}</p>
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
						<p>badges</p>
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
							class="max-w-36 my-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
	<div class="flex gap-2 mt-8">
		<input
			type="checkbox"
			id="clientCards"
			name="clientCards"
			value={showClient}
			on:change={() => {
				showClient = !showClient
			}}
			checked={showClient || (ua !== '' && (decks !== '' || collections !== '' || bids !== ''))}
		/>
		<label for="clientCards">Check with decks, collections, and bids</label><br />
	</div>
	{#if showClient || (ua !== '' && (decks !== '' || collections !== '' || bids !== '') === true)}
		<ClientCards bind:ua bind:decks bind:collections bind:bids />
	{/if}
	<div class="space-x-4 mt-8">
		<Button
			disabled={clauses.length === 1 &&
				(clauses[0].whereValue === 'status' || !clauses[0].whereValue)}
			type="submit">Compute</Button
		>
		<Popover.Root>
			<Popover.Trigger>
				<Button disabled={!(!errorMessage && returnedItems[0])}>Download</Button></Popover.Trigger
			>
			<Popover.Content class="flex flex-col w-min border-none gap-4 -mt-0">
				<Button
					disabled={!(!errorMessage && returnedItems[0])}
					type="submit"
					on:click={() => {
						let content = ''
						returnedItems.forEach(
							card =>
								//?generated_by=Queries__author_main_nation_Kractero__usedBy_${ua}
								(content += `<tr><td><p>S${card.season} ${card.id}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}">Link to Card</a></p></td></tr>\n`)
						)
						const blob = new Blob([htmlContent(content)], { type: 'text/html' })
						const url = URL.createObjectURL(blob)
						const a = document.createElement('a')
						a.href = url
						a.download = `${dlFileName}.html`
						document.body.appendChild(a)
						a.click()
						document.body.removeChild(a)
						URL.revokeObjectURL(url)
					}}>Sheet</Button
				>
				<Button
					disabled={!(!errorMessage && returnedItems[0])}
					type="submit"
					on:click={() => {
						let content = returnedItems.map(card => `${card.id},${card.season}`).join('\n')
						const blob = new Blob([content], { type: 'text/plain' })
						const url = URL.createObjectURL(blob)
						const a = document.createElement('a')
						a.href = url
						a.download = `${dlFileName}.txt`
						document.body.appendChild(a)
						a.click()
						document.body.removeChild(a)
						URL.revokeObjectURL(url)
					}}>IDs txt</Button
				>
				<Button
					disabled={!(!errorMessage && returnedItems[0])}
					type="submit"
					on:click={() =>
						downloadCSV(
							returnedItems,
							`?select=${queryWhereValue === '*' ? 'all' : 'min'}&from=${selectValue}&clauses=${clauseAsString.join(',')}.csv`
						)}>CSV</Button
				>
			</Popover.Content>
		</Popover.Root>
	</div>
</form>

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}

{#if !errorMessage && returnedItems[0] && returnedItems[0].cardcategory}
	<Pagination bind:currentPage bind:returnedItems />
	<div class="flex flex-wrap justify-center">
		{#each currentCards as card}
			{#if card.season !== 3}
				<S1S2Card {card} />
			{:else}
				<S3Card {card} />
			{/if}
		{/each}
	</div>
	<Pagination bind:currentPage bind:returnedItems />
{:else if !errorMessage && returnedItems[0]}
	<Pagination bind:currentPage bind:returnedItems />
	<div class="flex flex-col dark:text-white">
		{#each currentCards as card}
			<a href={`https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}`}>
				{card.season}
				{card.name}
			</a>
		{/each}
	</div>
	<Pagination bind:currentPage bind:returnedItems />
{/if}

<PreviousQueries bind:clauseHistory />
