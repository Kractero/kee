<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination'
	import { fetchCards } from '$lib/helpers/fetchCards'

	let {
		cards = $bindable(),
		checkingClient,
		currentPage = $bindable(),
		total = $bindable(),
	} = $props()

	function handlePageChange(changedPage: number) {
		currentPage = changedPage
		if (!checkingClient) {
			fetchCards(`${location.search.replace('?', '')}&page=${changedPage}`)
				.then(newData => {
					cards = newData.cards
					total = newData.total
				})
				.catch(err => {
					console.error('Failed to fetch cards:', err)
				})
		}
	}
</script>

<Pagination.Root count={total} perPage={25} onPageChange={handlePageChange}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
