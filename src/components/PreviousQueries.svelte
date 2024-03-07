<script lang="ts">
	import type { Clause } from "$lib/types";
  import { Trash } from "lucide-svelte"
	import {
		PUBLIC_URL
	} from '$env/static/public';
  export let clauseHistory: Array<Clause>;
</script>

<h2 class='text-lg font-bold mb-2 text-center mt-16'>Previous Queries</h2>
<div class="flex flex-col gap-4 max-w-xs">
  {#each clauseHistory as clause}
    <div class="flex">
      <button on:click={() => {
        clauseHistory = clauseHistory.filter(query => {
          return query !== clause
        })
        localStorage.setItem('clauses', JSON.stringify(clauseHistory))
      }}>
        <Trash class='hover:cursor-pointer' />
      </button>
      <a class="line-clamp-2 hover:text-purple-700 hover:cursor-pointer flex-1 text-right" target="_blank" href={`${PUBLIC_URL}/${clause}`}>{clause}</a>
    </div>
  {/each}
</div>

