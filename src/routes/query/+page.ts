import { buildCards } from "$lib/helpers/buildCards"
import { fetchCards } from "$lib/helpers/fetchCards"
import type { Card, Clause } from "$lib/types"
import type { PageLoad } from "./$types"
import { building } from '$app/environment';

export const load: PageLoad = async ({ url }) => {
	if (building) return

	let cards = [] as Card[]
	let limit = Number(url.searchParams.get('limit') || 25)
	let page = Number(url.searchParams.get('page') || 1)
	let err = ""
	const emptyClause = {
			qualifier: 'AND',
			whereValue: '',
			conditionValue: 'IS',
			badgeTrophyValue: '',
			input: '',
			trophyPercentage: ''
		}

	const selectValue = url.searchParams.get('from') || 'S4'
	const season = Number(selectValue[1])
	const queryWhereValue =
			url.searchParams.has('select') && url.searchParams.get('select') === 'id, name'
				? 'id, name' : '*'

	const buildClauses =
		url.searchParams.has('clauses') && url.searchParams.get('clauses') !== null
			? url.searchParams
					.get('clauses')!
					.split(',')
					.map((clause: string) => {
						const clauser = clause.split('-')
						return {
							whereValue: clauser[0] || '',
							conditionValue: clauser[1] || clauser[0],
							input: clauser[2] || clauser[1],
							badgeTrophyValue: '',
							trophyPercentage: clauser[0] === 'trophies' ? clauser[3] : '',
						}
					})
			: []
	const clauseAsString = (buildClauses.length ? [...buildClauses] : [emptyClause])
		.map(({ whereValue, conditionValue, input, trophyPercentage }: Clause) =>
			`${whereValue}-${conditionValue}-${input}${trophyPercentage ? `-${trophyPercentage}` : ''}`
		)


	const ua =
		url.searchParams.has('ua') && url.searchParams.get('ua') !== null
			? url.searchParams.get('ua')
			: ''
	const decks =
		url.searchParams.has('decks') && url.searchParams.get('decks') !== null
			? url.searchParams.get('decks')
			: ''
	const collections =
		url.searchParams.has('collections') &&
		url.searchParams.get('collections') !== null
			? url.searchParams.get('collections')
			: ''
	const bids =
		url.searchParams.has('bids') && url.searchParams.get('bids') !== null
			? url.searchParams.get('bids')
			: ''

	let cardsToPass: Array<{ CARDID: number; SEASON: number }> = []
	if (!ua) return

	const checkingClient = Boolean(decks || collections || bids)
	if (checkingClient) {
		cardsToPass = await buildCards(
			ua,
			collections ? collections.split(',') : undefined,
			decks ? decks.split(',') : undefined,
			bids ? bids.split(',') : undefined
		)
	}
	let baseQ = `select=${queryWhereValue === 'id, name' ? 'id, name' : 'all'}&from=${selectValue}&clauses=${clauseAsString.join(',')}&ua=${ua}`
	if (decks) baseQ += `&decks=${decks}`
	if (collections) baseQ += `&collections=${collections}`
	if (bids) baseQ += `&bids=${bids}`
	const fullQ = `select=${queryWhereValue === 'id, name' ? 'id, name' : 'all'}&from=${selectValue}&clauses=${clauseAsString.join(',')}&ua=${ua}&limit=${checkingClient ? 25555555 : limit}&page=${page}`
	try {
		let { cards: data, total, limit, page } = await fetchCards(fullQ)

		if (queryWhereValue === 'id, name') {
			data = data.map((card: { id: number; name: string }) => ({
				...card,
				season: Number(selectValue[1]),
			}))
		}

		if (cardsToPass) {
			data = data.filter((card: { id: number; season: number }) => {
				return !cardsToPass.some(
					collectionCard => collectionCard.CARDID === card.id && collectionCard.SEASON === season
				)
			})
		}

		cards = data

		return { cards, total: checkingClient ? cards.length : total, limit, page, err, ua, query: baseQ, season, checkingClient }
	} catch (error: unknown) {
		console.error('Error:', error)
		if (error instanceof Error) {
			err = 'An error occured: with ' + error.message
		}
		return { err }
	}
}