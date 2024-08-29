<script lang="ts">
	import { badgesDict } from "$lib/imageMatching";

  export let cardBadges: any;
  export let cardTrophies: any;
  function getEasterEggReplacement(value: any) {
      return value >= 4 ? '4' : String(value);
  }
</script>

<div id="wabadges">
  {#if Object.keys(cardBadges).includes('Condemned')}
      <p class="wabadge">
          <img src="https://www.nationstates.net/images/condemn.png" class="badge" alt="Condemnation badge" />
      </p>
  {:else if Object.keys(cardBadges).includes('Commended')}
      <p class="wabadge">
          <img src="https://www.nationstates.net/images/commend.png" class="badge" alt="Commendation badge" />
      </p>
  {/if}
</div>

<div class="specialbadges">
  {#each Object.keys(cardBadges) as badge, i}
      {#if badge === 'Easter Egg'}
        <img alt={badge} src={`https://www.nationstates.net/images/trophies/${badgesDict[badge].replace('1', getEasterEggReplacement(Object.values(cardBadges)[i]))}.png`}
        class="trophy inline" title={badge} />
      {:else if badgesDict[badge]}
          <img alt={badge} src={`https://www.nationstates.net/images/trophies/${badgesDict[badge]}.png`}
              class="trophy inline" title={badge} />
      {/if}
  {/each}
</div>

<div id="trophycabinet">
  {#each cardTrophies as trophy, i}
      <img src={`https://www.nationstates.net/images/trophies/${trophy.toLowerCase()}.png`} class="trophy inline"
          alt={`${trophy.toLowerCase()} ranked ${cardTrophies[i]}`} />
  {/each}
</div>