<script lang="ts">
	import { banners } from '$lib/banners'
	import type { Card } from '$lib/types'

	import Badges from './Badges.svelte'
	import S2S3Description from './S2S3Description.svelte'

	import './cards.css'

	export let card: Card
	export let opt: string = ''
	export let url: string = ''
	export let season: number
	export let ua: string
</script>

<a
	href={url
		? url
		: `https://www.nationstates.net/page=deck/card=${card.id}/season=${season}?generated_by=Queries__author_main_nation_Kractero__usedBy_${ua}`}
	target="_blank"
	rel="noopener noreferrer"
>
	<div class={`deckcard-container border-2 border-solid ${card.cte === true && 'opacity-50'}`}>
		<div class={`deckcard deckcard-season-${season}`} data-cardid={card.id} data-season={season}>
			<figure class={`front deckcard-category-${card.cardcategory}`}>
				<div
					class="deckcard-flag"
					style={`background-image: ${card.flag.includes('./') ? `url(${card.flag.replace('./', '')})` : `url(https://www.nationstates.net/images/cards/s${season}/${card.flag})`};`}
				></div>
				<div class="deckcard-category"></div>
				<div class="deckcard-title">
					<p class="nlink nameblock">
						<span class="nnameblock"
							><span class="ntype">The {card.type} of</span>
							<span class="nname"> {card.name}</span></span
						>
					</p>
				</div>
				<div class="deckcard-lower">
					<div class="deckcard-govt">{card.category}</div>
					<div class="deckcard-slogan">“{card.motto}”</div>
					<div class="deckcard-badges">
						{#if opt && season === 2}
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
						{#if opt && season === 1}
							<p class="text-[0.6rem] p-1">{opt}</p>
						{:else if card.description}
							{#if season === 1}
								<p class="text-[0.6rem] p-1">{card.description}</p>
							{:else}
								<S2S3Description description={card.description} />
							{/if}
						{/if}
					</div>
				</div>
				<div class="deckcard-stripe">
					<div class="deckcard-season">SEASON {season === 1 ? 'ONE' : 'TWO'}</div>
					<div class="deckcard-region"><p class="rlink">{card.region}</p></div>
				</div>
			</figure>
		</div>
	</div>
</a>
