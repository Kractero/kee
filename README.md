<div align="center">
<h1>Card Queries</h1>

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

Card Queries is a frontend interface that provides access to a database containing the trading card dumps provided by NationStates.

It enables users to retrieve card-related information through various queries. However, specific features related to collections and decks are handled exclusively on the frontend. These functionalities rely on making API calls to NationStates, and to mitigate potential rate-limiting issues, I have chosen to keep these operations on the client-side.

Queries does not aim to replicate or dream to match r3n's card queries, but it does seek to provide similar functionalities by enabling users to retrieve cards based on desired parameters.

The frontend is hosted on github pages while the api is hosted on a hetzner vps.