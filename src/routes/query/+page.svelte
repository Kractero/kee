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
	import { loadCards } from '$lib/helpers/processQuery'
	import type { Card } from '$lib/types'

	let cards: Card[] = $state([])
	let currentPage: number = $state(1)
	let total: number = $state(0)
	let ua: string = $state('')
	let query: string = $state('')
	let season: number = $state(4)
	let checkingClient: boolean = $state(false)
	let errorMessage: string = $state('')
	let clauseHistory: string[] = []
	let cardsPromise: Promise<void> = $state(Promise.resolve())

	onMount(async () => {
		cardsPromise = loadCards(new URL(window.location.href)).then(result => {
			if (result) {
				cards = result.cards || []
				total = result.total || total
				currentPage = result.page || currentPage
				ua = result.ua || ua
				query = result.query || query
				season = result.season || season
				checkingClient = result.checkingClient || checkingClient
				errorMessage = result.err || ''
			}

			clauseHistory = localStorage.getItem('clauses')
				? JSON.parse(localStorage.getItem('clauses')!)
				: []
			if (!clauseHistory.includes(query)) clauseHistory.push(query)
			localStorage.setItem('clauses', JSON.stringify(clauseHistory))
		})
	})

	let lastPostIndex = $derived(checkingClient ? currentPage * 25 : 25)
	let firstPostIndex = $derived(checkingClient ? lastPostIndex - 25 : 0)
</script>

<Head title={`Queries - Results`} description={`Result of ${query}`} />

<Button href="/">New Query</Button>

{#await cardsPromise}
	<p class="mt-8">Loading…</p>
{:then}
	{#if cards && cards.length > 0 && !errorMessage}
		<div class="space-x-4 mt-8 mb-8">
			<Popover.Root>
				<Popover.Trigger
					disabled={!(!errorMessage && cards[0])}
					class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
					>Download</Popover.Trigger
				>
				<Popover.Content
					class="flex flex-col w-min border-none gap-4 -mt-0 bg-secondary-foreground"
				>
					<Button
						disabled={!(!errorMessage && cards[0])}
						type="submit"
						onclick={async () => {
							let content = ''
							const { cards }: { cards: Card[] } = await fetchCards(
								`${location.search.replace('?', '')}&limit=252525252525`
							)
							cards.forEach(
								card =>
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
						onclick={async () => {
							const { cards }: { cards: Card[] } = await fetchCards(
								`${location.search.replace('?', '')}&limit=252525252525`
							)
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
						onclick={async () => {
							const { cards }: { cards: Card[] } = await fetchCards(
								`${location.search.replace('?', '')}&limit=252525252525`
							)
							downloadCSV(cards, `${query}.csv`)
						}}>CSV</Button
					>
				</Popover.Content>
			</Popover.Root>
		</div>

		{#if cards[0] && cards[0].cardcategory}
			<Pagination {checkingClient} bind:cards bind:currentPage bind:total />
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
		{:else}
			<Pagination {checkingClient} bind:cards bind:currentPage bind:total />
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
{/await}
