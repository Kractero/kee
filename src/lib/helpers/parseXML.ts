import { XMLParser } from 'fast-xml-parser';

export const parser = new XMLParser({ ignoreAttributes: false });

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseXML(url: string, userAgent: string, password?: string) {
	const headers: Record<string, string> = {
		'User-Agent': `Used by ${userAgent} with Queries, written by Kractero`
	};

	if (password) {
		headers['X-Password'] = password;
	}

	const response = await fetch(`${url}&userAgent=Used by ${userAgent} with Queries, written by Kractero`, {
		method: 'GET',
		headers
	});

	if (response.status === 404) {
		return { "status": `failed with error code 404` }
	}

	if (response.status === 409) {
		return { "status": `failed with error code 409` }
	}

	if (response.status === 429) {
		await sleep(Number(response.headers.get('retry-after')) * 1000 + 2000)
		return await parseXML(url, userAgent, password ? password : "")
	}

	const xml = await response.text();
	const xmlObj = parser.parse(xml);
	return xmlObj;
}