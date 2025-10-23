import { PUBLIC_API_URL } from "$env/static/public"

export async function fetchCards(query: string) {
        const response = await fetch(
            `${PUBLIC_API_URL}/api?${query}`,
            {
                headers: {
                    'X-Origin': 'frontend',
                },
            }
        )

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

        return await response.json()
}