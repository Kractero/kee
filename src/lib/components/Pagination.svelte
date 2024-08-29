<script lang="ts">
  import * as Pagination from '$lib/components/ui/pagination';
	import type { Card } from '$lib/types';
  export let returnedItems: Card[];
  export let currentPage: number;
</script>

<Pagination.Root count={returnedItems.length} perPage={25} let:pages>
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.PrevButton on:click={() => (currentPage = currentPage - 1)} />
    </Pagination.Item>
    {#each pages as page (page.key)}
      {#if page.type === 'ellipsis'}
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
      {:else}
        <Pagination.Item>
          <Pagination.Link {page} isActive={currentPage == page.value} on:click={() => (currentPage = page.value)}>
            {page.value}
          </Pagination.Link>
        </Pagination.Item>
      {/if}
    {/each}
    <Pagination.Item>
      <Pagination.NextButton on:click={() => (currentPage = currentPage + 1)} />
    </Pagination.Item>
  </Pagination.Content>
</Pagination.Root>