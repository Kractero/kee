# Kee

Queries is a web application that provides access to a database containing the trading card dumps provided by NationStates.

Queries does not aim to replicate or dream to match r3n's card queries, but it does seek to provide similar functionalities by enabling users to retrieve cards based on desired parameters.

## 🔧 Local Install

### Frontend Locally

1. Clone the repo `https://github.com/Kractero/kee.git`
2. CD into installation location.
3. `npm install`
4. `npm run dev`

### API Locally

1. Clone the repo `https://github.com/Kractero/kee.git`
2. CD into installation location.
3. Install the dumps from [NS S3](https://www.nationstates.net/pages/cardlist_S3.xml.gz), [NS S2](https://www.nationstates.net/pages/cardlist_S2.xml.gz), [NS S1](https://www.nationstates.net/pages/cardlist_S!.xml.gz).
4. Convert the dumps to JSONL.
5. Run the python script `python build_db.py` to build the local sqlite database, and then move it into the backend folder.
6. CD into backend.
7. `npm install`
8. `npm run dev`

![Frostleaf](./static/Frostleaf.jpg)