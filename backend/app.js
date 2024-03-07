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

app.get('/', async (req, res) => {
  let query = ''
  if (req.query.select && ['all', 'minimal'].includes(req.query.select)) {
    if (req.query.select === "all") query += `SELECT *`
    else query += `SELECT (id, name, season)`
  }
  else query += `SELECT *`

  if (req.query.from && ['S1', 'S2', 'S3'].includes(req.query.from)) query += ` FROM ${req.query.from} WHERE`
  else query += ` FROM S3 WHERE`
  const testBuildClauses = req.query.clauses ? req.query.clauses.split(',').map((clause) => {
    const clauser = clause.split('-')
    return {
      qualifier: ['OR', 'AND'].includes(clauser[0]) ? clauser[0] : "",
      whereValue: ['OR', 'AND'].includes(clauser[0]) ? clauser[1] : clauser[0],
      conditionValue: ['OR', 'AND'].includes(clauser[0]) ? clauser[2] : clauser[1],
      badgeTrophyValue: "",
      input: ['OR', 'AND'].includes(clauser[0]) ? clauser[3] : clauser[2],
      trophyPercentage: ['OR', 'AND'].includes(clauser[0]) ? clauser[4] ? clauser[4] : "" : clauser[3] ? clauser[3] : "",
    }
  }) : []
  for (let i = 0; i < testBuildClauses.length; i++) {
    const clause = testBuildClauses[i];

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
              query += ` JSON_EXTRACT(${clause.whereValue}, '$.${clause.input}') ${clause.conditionValue === "IS" ? " = 1" : "IS NULL"}`;
            }
          } else {
            if (clause.conditionValue === 'HAS NO') {
              query += ` JSON_EXTRACT(trophies, '$') = '{}';;`
            } else {
              query += ` JSON_EXTRACT(${clause.whereValue}, '$.${trophies[clause.input]}-${clause.trophyPercentage}') ${clause.conditionValue === "IS" ? " IS NOT NULL" : "IS NULL"}`;
            }
          }
        } else {
          query += ` ${clause.whereValue} ${clause.conditionValue} ${clause.conditionValue.includes("LIKE") ? `'%${clause.input}%'` : `'${clause.input}'`} COLLATE NOCASE`;
        }
      }
    }
  }
  let test = db.prepare(query).all()

  test.forEach(testItem => {
    if (testItem.badges) {
      testItem.badges = JSON.parse(testItem.badges)
    }
    if (testItem.trophies) {
      testItem.trophies = JSON.parse(testItem.trophies)
    }
  })

  res.send(test)
})

app.get('/health', async (req, res) => {
  res.status(200).send();
});

app.listen(port, () => {
  console.log("App live on " + port)
})