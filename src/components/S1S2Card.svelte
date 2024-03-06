<script lang="ts">
	import Badges from "./Badges.svelte";
	import S2S3Description from "./S2S3Description.svelte";

  export let card: any;

  export let opt: any = "";
  export let url: any = "";
  const banners: { [key: string]: string } = {
    "Admin": "mod_status",
    "Game Mod": "mod_status",
    "WA": "wa_status",
    "Delegate": "wa_status",
    "Secretariat": "wa_status",
    "Issues Editor": "semimod_status",
    "Roleplay Mentor": "mentor_status",
    "Class": "class_status"
  }
</script>

<a href={url ? url : `https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}`} target="_blank" rel="noopener noreferrer">
  <div class={`deckcard-container ${card.inCollection !== undefined ? card.inCollection ? 'border-blue-400 border-2 border-solid' : 'border-red-600 border-2 border-solid' : ""}`}>
      <div class={`deckcard deckcard-season-${card.season}`} data-cardid={card.id} data-season={card.season}>
          <figure class={`front deckcard-category-${card.cardcategory}`} >
              <div class="deckcard-flag" style={`background-image: ${card.flag.includes('./') ? `url(${card.flag}` : `url(https://www.nationstates.net/images/cards/s${card.season}/${card.flag})`};`}>
              </div>
              <div class="deckcard-category"></div>
              <div class="deckcard-title"><p class="nlink nameblock"><span
                  class="nnameblock"><span class="ntype">The {card.type} of</span> <span class="nname"> {card.name}</span></span></p></div>
              <div class="deckcard-lower">
                  <div class="deckcard-govt">{card.category}</div>
                  <div class="deckcard-slogan">“{card.motto}”</div>
                  <div class="deckcard-badges">
                      {#if opt && card.season === 2}
                        <p class="text-[0.5rem] p-1">{opt}</p>
                      {/if}
                      {#each Object.keys(card.badges) as badge}
                        {#if banners[badge]}
                              <div class="badge">
                                <div class={banners[badge]}><i class="icon-flash"></i>{badge}</div>
                            </div>
                        {/if}
                      {/each}
                      <Badges cardBadges={card.badges} cardTrophies={Object.keys(card.trophies)} />
                  </div>
                  <div class="deckcard-desc">
                    {#if opt && card.season === 1}
                      <p class="text-[0.6rem] p-1">{opt}</p>
                      {:else if card.description}
                          {#if card.season === 1}
                              <p class="text-[0.6rem] p-1">{card.description}</p>
                          {:else}
                              <S2S3Description description={card.description} />
                          {/if}
                      {/if}
                  </div>
              </div>
              <div class="deckcard-stripe">
                  <div class="deckcard-season">SEASON {card.season === 1 ? "ONE" : "TWO"}</div>
                  <div class="deckcard-region"><p class="rlink">{card.region}</p>
                  </div>
              </div>
          </figure>
      </div>
  </div>
</a>