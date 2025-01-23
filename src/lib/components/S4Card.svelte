<script lang="ts">
	import { banners } from '$lib/banners'
	import { badgesDict } from '$lib/imageMatching'
	import type { Card } from '$lib/types'

	import './cards.css'

	export let card: Card
	export let opt: string = ''
	export let url: string = ''
	export let ua: string

	const categoryBlockMapping: { [key: string]: number } = {
		common: 1,
		uncommon: 2,
		rare: 3,
		'ultra-rare': 4,
		epic: 5,
		legendary: 6,
	}

	function getEasterEggReplacement(value: any) {
		return value >= 4 ? '4' : String(value)
	}
</script>

<a
	href={url
		? url
		: `https://www.nationstates.net/page=deck/card=${card.id}/season=4?generated_by=Queries__author_main_nation_Kractero__usedBy_${ua}`}
	target="_blank"
	rel="noopener noreferrer"
>
	<div class={`deckcard-container border-2 border-solid ${card.cte === true && 'opacity-50'}`}>
		<div class="deckcard deckcard-season-4" data-cardid={card.id} data-season="4">
			<figure class={`front deckcard-category-${card.cardcategory}`}>
				<div class={`s4-card ${card.cardcategory}`}>
					<div class="top">
						<header
							style={`background-image: linear-gradient(0deg, var(--${card.cardcategory}-main), var(--${card.cardcategory}-main)), linear-gradient(0deg, var(--${card.cardcategory}-dark), var(--${card.cardcategory}-dark)), url(https://www.nationstates.net/images/banners/${card.banner});`}
						>
							<span class="bold rarity">{card.cardcategory}</span>
							<div class="rarity-indicator">
								{#each Array(categoryBlockMapping[card.cardcategory] || 0).fill(0) as _, index}
									<div class="rarity-indicator-block" title={`Block ${index + 1}`}></div>
								{/each}
							</div>
						</header>
						<main
							class="flag"
							style={`background-image: url(https://www.nationstates.net/images/cards/s4/${card.flag}), linear-gradient(0deg, var(--${card.cardcategory}-b1), var(--${card.cardcategory}-b1))`}
						>
							<div class="deckcard-info">
								<div class="deckcard-info-content">
									<div class="deckcard-info-cardnumber">
										<a href={`"/page=deck/card=${card.id}/season=4"`}>#{card.id} /4</a>
									</div>
									<div class="deckcard-info-cardlink">
										<a href={`"/page=deck/card=${card.id}/season=4"`}>Info</a>
									</div>
								</div>
							</div>

							<span class="pretitle">The {card.type} of</span>
						</main>
					</div>
					<div
						class="bottom"
						style={`background-image: url(https://www.nationstates.net/images/banners/${card.banner}), linear-gradient(0deg, var(--${card.cardcategory}-dark), var(--${card.cardcategory}-dark))`}
					>
						<main>
							<div class="s4-card-wrapper">
								<a
									href={`https://www.nationstates.net/nation=${card.name.toLowerCase().replaceAll(' ', '_')}`}
									class="title">{card.name}</a
								>
								<div class="deckcard-badges">
									{#each Object.keys(card.badges) as badge}
										{#if banners[badge]}
											<div class="badge">
												<div class={banners[badge]}><i class="icon-flash"></i>{badge}</div>
											</div>
										{/if}
									{/each}
								</div>
							</div>
							<div class="motto-box">
								<span class="motto"> {card.motto} </span>
							</div>
							<div class="deckcard-season-4-wrapper">
								<div class="trophies-section">
									<div class="specialbadges">
										{#each Object.keys(card.badges) as badge, i}
											{#if badge === 'Easter Egg'}
												<img
													alt={badge}
													src={`https://www.nationstates.net/images/trophies/${badgesDict[badge].replace('1', getEasterEggReplacement(Object.values(card.badges)[i]))}.png`}
													class="trophy inline"
													title={badge}
												/>
											{:else if badgesDict[badge]}
												<img
													alt={badge}
													src={`https://www.nationstates.net/images/trophies/${badgesDict[badge]}.png`}
													class="trophy inline"
													title={badge}
												/>
											{/if}
										{/each}
									</div>
									<div id="trophycabinet">
										{#each Object.keys(card.trophies) as trophy, i}
											<img
												src={`https://www.nationstates.net/images/trophies/${trophy.toLowerCase()}.png`}
												class="trophy inline"
												alt={`${trophy.toLowerCase()} ranked ${Object.values(card.trophies)[i]}`}
											/>
										{/each}
									</div>
								</div>
								<div class="lower-info">
									<span class="population">
										100<span class="pop-units">b</span><i class="icon-male"></i>
									</span>
									<span class="category"> {card.category} </span>
									<span class="gdp">
										10,000<span class="pop-units">t</span><i class="icon-industrial-building"></i>
									</span>
								</div>
							</div>
						</main>
						<footer
							style={`background-image: linear-gradient(0deg, var(--${card.cardcategory}-main), var(--${card.cardcategory}-main)), linear-gradient(0deg, var(--${card.cardcategory}-dark), var(--${card.cardcategory}-dark)), url(https://www.nationstates.net/images/banners/${card.banner});`}
						>
							<span class="">SEASON FOUR</span>
							<a href={`region=${card.region.toLowerCase().replaceAll(' ', '_')}`} class="rlink"
								>{card.region}</a
							>
						</footer>
					</div>
				</div>
			</figure>
			<figure class="back"></figure>
		</div>
	</div>
</a>
