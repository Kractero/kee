import Database from "better-sqlite3"
import express from "express"
import cors from "cors";
import { trophies } from "./trophies.js"

const port = 3000;

const db = new Database('cards_season.db');

const app = express()
app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 30 * 1000,
//   max: 50,
//   message: { error: 'Rate limit exceeded', status: 429 },
// });

app.use(cors());

app.post('/ui', async (req, res) => {
  try {
    const queryParameters = req.body.query;
    let query = `SELECT ${queryParameters.mainWhereValue} FROM ${queryParameters.table} WHERE`;

    for (let i = 0; i < queryParameters.clauses.length; i++) {
      const clause = queryParameters.clauses[i];

      if (clause.whereValue !== '') {
        query += ` ${clause.qualifier}`;

        if (clause.whereValue === "exnation") {
          query += ` REGION IS NULL`
        } else {
          if (['badges', 'trophies'].includes(clause.whereValue)) {
            if (clause.whereValue === "badges") {
              if (clause.conditionValue === 'HAS NO') {
                query += ` JSON_EXTRACT(badges, '$') = '{}';;`
              } else {
                query += ` JSON_EXTRACT(${clause.whereValue}, '$.${clause.badgeTrophyValue}') ${clause.conditionValue === "IS" ? " = 1" : "IS NULL"}`;
              }
            } else {
              if (clause.conditionValue === 'HAS NO') {
                query += ` JSON_EXTRACT(trophies, '$') = '{}';;`
              } else {
                query += ` JSON_EXTRACT(${clause.whereValue}, '$.${trophies[clause.badgeTrophyValue]}-${clause.trophyPercentage}') ${clause.conditionValue === "IS" ? " IS NOT NULL" : "IS NULL"}`;
              }
            }
          } else {
            query += ` ${clause.whereValue} ${clause.conditionValue} ${clause.conditionValue.includes("LIKE") ? `'%${clause.input}%'` : `'${clause.input}'`} COLLATE NOCASE`;
          }
        }
      }
    }
    let test = db.prepare(query).all()
    console.log(test)
  } catch (err) {
    console.log(err)
  }
})

app.get('/health', async (req, res) => {
  res.status(200).send();
});

app.listen(port, () => {
  console.log("App live on " + port)
})