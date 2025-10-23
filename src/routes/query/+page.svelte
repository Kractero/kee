<script lang="ts">
	import { onMount } from 'svelte'
	import Head from '$lib/components/Head.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import S1S2Card from '$lib/components/S1S2Card.svelte'
	import S3Card from '$lib/components/S3Card.svelte'
	import S4Card from '$lib/components/S4Card.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import * as Popover from '$lib/components/ui/popover'
	import { downloadCSV } from '$lib/helpers/download.js'
	import { fetchCards } from '$lib/helpers/fetchCards'
	import { htmlContent } from '$lib/helpers/htmlContent.js'
	import type { Card } from '$lib/types'

	import type { PageProps } from './$types'

	let { data }: PageProps = $props()
	let { err: errorMessage, ua, query, season, checkingClient } = data
	let cards: Card[] = $state(data.cards || [])
	let currentPage: number = $state(data.page)
	let total: number = $state(data.total)

	$effect(() => {
		if (!checkingClient && currentPage) {
			fetchCards(`${location.search}&page=${currentPage}`)
				.then(newData => {
					cards = newData.cards
					total = newData.total
				})
				.catch(err => {
					console.error('Failed to fetch cards:', err)
				})
		}
	})

	let clauseHistory: string[] = []
	onMount(async () => {
		clauseHistory = localStorage.getItem('clauses')
			? JSON.parse(localStorage.getItem('clauses')!)
			: []
		if (localStorage.getItem('clauses') !== null) {
			if (!clauseHistory.includes(query)) {
				clauseHistory = [...clauseHistory, query]
			}
			localStorage.setItem('clauses', JSON.stringify(clauseHistory))
		} else {
			clauseHistory = [query]
			localStorage.setItem('clauses', JSON.stringify(clauseHistory))
		}
	})

	let lastPostIndex = $derived(checkingClient ? currentPage * 25 : 25)
	let firstPostIndex = $derived(checkingClient ? lastPostIndex - 25 : 0)
</script>

<Head title={`Queries - Results`} description={`Result of ${data.query}`} />

<Button href="/">New Query</Button>
{#if cards && cards.length > 0 && !errorMessage}
	<div class="space-x-4 mt-8 mb-8">
		<Popover.Root>
			<Popover.Trigger>
				<Button disabled={!(!errorMessage && cards[0])}>Download</Button></Popover.Trigger
			>
			<Popover.Content class="flex flex-col w-min border-none gap-4 -mt-0 bg-secondary-foreground">
				<Button
					disabled={!(!errorMessage && cards[0])}
					type="submit"
					onclick={() => {
						let content = ''
						cards.forEach(
							card =>
								//?generated_by=Queries__author_main_nation_Kractero__usedBy_${ua}
								(content += `<tr><td><p>S${season} ${card.id}</p></td><td><p><a target="_blank" href="https://www.nationstates.net/page=deck/card=${card.id}/season=${season}?generated_by=Queries__author_main_nation_Kractero__usedBy_${ua}">Link to Card</a></p></td></tr>\n`)
						)
						const blob = new Blob([htmlContent(content)], { type: 'text/html' })
						const url = URL.createObjectURL(blob)
						const a = document.createElement('a')
						a.href = url
						a.download = `${query}.html`
						document.body.appendChild(a)
						a.click()
						document.body.removeChild(a)
						URL.revokeObjectURL(url)
					}}>Sheet</Button
				>
				<Button
					disabled={!(!errorMessage && cards[0])}
					type="submit"
					onclick={() => {
						let content = cards.map(card => `${card.id},${season}`).join('\n')
						const blob = new Blob([content], { type: 'text/plain' })
						const url = URL.createObjectURL(blob)
						const a = document.createElement('a')
						a.href = url
						a.download = `${query}.txt`
						document.body.appendChild(a)
						a.click()
						document.body.removeChild(a)
						URL.revokeObjectURL(url)
					}}>IDs txt</Button
				>
				<Button
					disabled={!(!errorMessage && cards[0])}
					type="submit"
					onclick={() => downloadCSV(cards, `${query}.csv`)}>CSV</Button
				>
			</Popover.Content>
		</Popover.Root>
	</div>

	{#if !errorMessage && cards[0] && cards[0].cardcategory}
		<Pagination bind:pageNumber={currentPage} {total} />
		<div class="mt-8 flex flex-wrap justify-center">
			{#each cards.slice(firstPostIndex, lastPostIndex) as card}
				{#if [1, 2].includes(season)}
					<S1S2Card {season} {card} {ua} />
				{:else if season === 3}
					<S3Card {card} {ua} />
				{:else}
					<S4Card {card} {ua} />
				{/if}
			{/each}
		</div>
	{:else if !errorMessage && cards[0]}
		<Pagination bind:pageNumber={currentPage} {total} />
		<div class="mt-8 flex flex-col gap-2 dark:text-white">
			{#each cards.slice(firstPostIndex, lastPostIndex) as card}
				<a
					class="hover:underline"
					target="_blank"
					href={`https://www.nationstates.net/page=deck/card=${card.id}/season=${season}?generated_by=Queries__author_main_nation_Kractero__usedBy_${ua}`}
				>
					{card.id}
					{card.name}
				</a>
			{/each}
		</div>
	{/if}
{:else if cards && cards.length === 0}
	<p class="mt-8">No cards found for query</p>
{:else if errorMessage}
	<p class="mt-8">{errorMessage}</p>
{/if}
