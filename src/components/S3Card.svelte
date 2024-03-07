<script lang="ts">
	import { banners } from '$lib/banners';
	import type { Card } from '$lib/types';
	import Badges from './Badges.svelte';
	import S2S3Description from './S2S3Description.svelte';

	export let card: Card;
	export let opt: string = '';
	export let url: string = '';
</script>

<a
	href={url ? url : `https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}`}
	target="_blank"
	rel="noopener noreferrer"
>
	<div
		class={`deckcard-container border-2 border-solid`}
	>
		<div class="deckcard deckcard-season-3" data-cardid={card.id} data-season="3">
			<figure class={`front deckcard-category-${card.cardcategory}`}>
				<div class="s3-content">
					<div class="s3-upper">
						<div class="s3-flagbox">
							<div class="s3-flag">
								<div class={`s3-flag-image`} style={`background-image: ${card.flag.includes('./') ? `url(${card.flag}` : `url(https://www.nationstates.net/images/cards/s3/${card.flag})`};`}
								></div>
							</div>
						</div>
						<div class="s3-topline">
							<div class="s3-topbox">
								<div class="s3-slogan">
									{card.motto}
								</div>
							</div>
						</div>
						<div class="deckcard-name">
							<p class="nlink nameblock">
								<span class="nnameblock"
									><span class="ntype"> The {card.type} of</span>
									<span class="nname">{card.name}</span></span
								>
							</p>
						</div>
					</div>
					<div class="s3-mid deckcard-badges">
						{#if opt}
							<p class="text-[0.5rem] p-1 text-black shadow-md">{opt}</p>
						{/if}
						<div class="role-badges">
							{#each Object.keys(card.badges) as badge}
								{#if banners[badge]}
									<div class="badge">
										<div class={banners[badge]}><i class="icon-flash"></i>{badge}</div>
									</div>
								{/if}
							{/each}
						</div>
						<div class="trophies">
							<Badges
								cardBadges={card.badges}
								cardTrophies={Object.keys(card.trophies)}
							/>
						</div>
					</div>
					<div class="s3-lower">
						<div class="deckcard-lower-collection deckcard-govt-collection">
							{#if card.description}
								<S2S3Description description={card.description} />
							{/if}
						</div>
						<div class="deckcard-lower-collection">
							<div class="deckcard-category"></div>
							<div class="deckcard-govt">
								{card.category}
							</div>
						</div>
						<div class="deckcard-stripe">
							<div class="deckcard-season">SEASON THREE</div>
							<div class="deckcard-region"><p class="rlink">{card.region}</p></div>
						</div>
					</div>
				</div>
			</figure>
		</div>
	</div>
</a>
