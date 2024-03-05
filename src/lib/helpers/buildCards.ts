import { parseXML } from "./parseXML"

export async function buildCards(UA: string, collections?: string[], decks?: string[], nations?: string[]) {
    let allCards: any = [];
    let seenCards = new Map<string, any>();

    if (collections) {
        for (let i = 0; i < collections.length; i++) {
            const cards = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+collection;collectionid=${collections[i]}`, UA);
            if (cards.CARDS && cards.CARDS.COLLECTION && cards.CARDS.COLLECTION.DECK && cards.CARDS.COLLECTION.DECK.CARD) {
                cards.CARDS.COLLECTION.DECK.CARD.forEach((card: any) => {
                    if (card.CARDID && card.SEASON && !seenCards.has(`${card.CARDID}-${card.SEASON}`)) {
                        allCards.push(card);
                        seenCards.set(`${card.CARDID}-${card.SEASON}`, card);
                    }
                });
            }
        }
    }

    if (decks) {
        for (let i = 0; i < decks.length; i++) {
            const cards = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+deck;nationname=${decks[i]}`, UA);
            if (cards.CARDS && cards.CARDS.DECK && cards.CARDS.DECK.CARD) {
                cards.CARDS.DECK.CARD.forEach((card: any) => {
                    if (card.CARDID && card.SEASON && !seenCards.has(`${card.CARDID}-${card.SEASON}`)) {
                        allCards.push(card);
                        seenCards.set(`${card.CARDID}-${card.SEASON}`, card);
                    }
                });
            }
        }
    }

    if (nations) {
        for (let i = 0; i < nations.length; i++) {
            const cards = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+asksbids;nationname=${nations[i]}`, UA);
            if (cards.CARDS && cards.CARDS.BIDS && cards.CARDS.BIDS.BID) {
                cards.CARDS.BIDS.BID.forEach((card: any) => {
                    if (card.CARDID && card.SEASON && !seenCards.has(`${card.CARDID}-${card.SEASON}`)) {
                        allCards.push(card);
                        seenCards.set(`${card.CARDID}-${card.SEASON}`, card);
                    }
                });
            }
            console.log(cards.CARDS.BIDS.BID)
        }
    }

    return allCards
}
