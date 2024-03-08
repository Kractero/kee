This serves as the frontend for an API built with Express which queries three sqlite tables for the three seasons.

It enables users to retrieve card-related information through various queries. However, specific features related to collections and decks are handled exclusively on the frontend. These functionalities rely on making API calls to NationStates, and to mitigate potential rate-limiting issues, I have chosen to keep these operations on the client-side.

## Interface

The interface, as opposed to card queries, is more representative of the queries being sent to the database. You add clauses which are are additional operators to the WHERE clause.

There is a checkbox that will show the option to pass in a required user agent, and then a combination of decks (nation name), collection (ids), and bids (nation name), and the cards returned from the query will be passed through the unique cards, and the ones that are not present in the combination will be returned. This is conducted on the client.

Previous queries are saved as urls.

## API

The api is built with Express. The main endpoint for interacting with trade records is the base route. This endpoint takes the exact same format as the frontend takes, and will parse it to make the same query.

### Perform A Query

- **Endpoint:** `/`
- **Method:** `GET`
- **Description:** Retrieve cards based on the parameters.

  - **Parameters:**
    - `select`: Expects value of `all` or `min`, although any value that is not `all` will be accepted. `all` translates to `SELECT *`, while the latter is `SELECT (id, name, season)`.
    - `from`: Expects a value of `S1`, `S2`, or `S3`. This translates to `FROM SX`.
    - `clauses`: A WHERE clause or AND/OR operator associated with a WHERE clause. Clauses are comma separated, and are formatted like `AND/OR`-`field`-`SPECIFY OPERATOR`-`VALUE`. For example, `name`-`LIKE`-`test`,`AND`-`cardcategory`-`IS`-`legendary`.

  - **Rate Limit:** 50 requests per 30 seconds.