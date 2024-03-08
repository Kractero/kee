import Database from "better-sqlite3"
import express from "express"
import cors from "cors";
import { trophies } from "./trophies.js"
import { rateLimit } from 'express-rate-limit'
import compression from "compression";
import helmet from "helmet";
import { getOrSetToCache } from "./getOrSetToCache.js";
import { logger } from "./logger.js";
import "dotenv/config.js";

const port = process.env.PORT || 3000;

const db = new Database('cards.db');

const app = express()
app.use(express.json());

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 50,
  message: { error: 'Rate limit exceeded', status: 429 },
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      'https://nakiri.vercel.app',
      "'unsafe-inline'"
    ],
    connectSrc: [
      "'self'",
      'https://nakiri.vercel.app'
    ],
  },
}));
app.use(cors());
app.use(compression());

app.get('/', limiter, async (req, res) => {
  try {
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

    let test = await getOrSetToCache(query, () => db.prepare(query).all())

    test.forEach(testItem => {
      if (testItem.badges) {
        testItem.badges = JSON.parse(testItem.badges)
      }
      if (testItem.trophies) {
        testItem.trophies = JSON.parse(testItem.trophies)
      }
    })

    res.send(test)
  } catch (err) {
    logger.error({
      params: req.query
    }, `An error occured on the / route: ${err}`)
  }
})

app.get('/health', async (req, res) => {
  logger.info("We live")
  res.status(200).send();
});

app.listen(port, () => {
  logger.info(`App started and listening on ${port}`)
})