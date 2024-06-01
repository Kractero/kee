import Database from "better-sqlite3"
import express from "express"
import cors from "cors";
import { trophies } from "./trophies.js"
import { rateLimit } from 'express-rate-limit'
import compression from "compression";
import { getOrSetToCache } from "./getOrSetToCache.js";
import { logger } from "./logger.js";
import "dotenv/config.js";

const port = process.env.PORT || 3000;

const app = express()
app.use(express.json());
app.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 50,
  message: { error: 'Rate limit exceeded', status: 429 },

});

app.use(cors());
app.use(compression());

app.get('/api', limiter, async (req, res) => {
  try {
    const db = new Database('cards.db');
    let query = ''
    if (req.query.select && ['all', 'min'].includes(req.query.select)) {
      if (req.query.select === "all") query += `SELECT *`
      else query += `SELECT id, name, season`
    }
    else query += `SELECT *`

    if (req.query.from && ['S1', 'S2', 'S3'].includes(req.query.from)) query += ` FROM ${req.query.from} WHERE`
    else query += ` FROM S3 WHERE`
    const clauseBuilder = req.query.clauses ? req.query.clauses.split(',').map((clause) => {
      const clauser = clause.split('-')
      if (clauser[3] === "rare") {
        clauser[2] = "ultra-rare"
        clauser.pop()
      }
      return {
        qualifier: ['OR', 'AND'].includes(clauser[0]) ? clauser[0] : "",
        whereValue: ['OR', 'AND'].includes(clauser[0]) ? clauser[1] : clauser[0],
        conditionValue: ['OR', 'AND'].includes(clauser[0]) ? clauser[2] : clauser[1],
        badgeTrophyValue: "",
        input: ['OR', 'AND'].includes(clauser[0]) ? clauser[3] : clauser[2],
        trophyPercentage: ['OR', 'AND'].includes(clauser[0]) ? clauser[4] ? clauser[4] : "" : clauser[3] ? clauser[3] : "",
      }
    }) : []
    for (let i = 0; i < clauseBuilder.length; i++) {
      const clause = clauseBuilder[i];

      if (clause.whereValue !== '') {
        query += ` ${clause.qualifier}`;

        if (clause.whereValue === "exnation") {
          query += ` REGION ${clause.input === "true" ? "IS NOT" : "IS"} NULL`
        } else {
          if (['badges', 'trophies'].includes(clause.whereValue)) {
            if (clause.whereValue === "badges") {
              if (clause.conditionValue === 'HAS NO') {
                query += ` JSON_EXTRACT(badges, '$') = '{}';;`
              } else {
                query += ` JSON_EXTRACT(${clause.whereValue}, '$.${clause.input}') ${clause.conditionValue === "IS" ? " >= 1" : "IS NULL"}`;
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

    let getCardsFromDB = await getOrSetToCache(query, () => db.prepare(query).all())

    getCardsFromDB.forEach(card => {
      if (card.badges) {
        card.badges = JSON.parse(card.badges)
      }
      if (card.trophies) {
        card.trophies = JSON.parse(card.trophies)
      }
    })

    res.send(getCardsFromDB)

    db.close();
  } catch (err) {
    logger.error({
      params: req.query
    }, `An error occured on the / route: ${err}`)
  }
})

// Cardle maybe
// app.get('/random', async (req, res) => {
//   const db = new Database('cards.db');

//   let season = 3;
//   let category = "legendary";
//   if ([1, 2, 3].includes(parseInt(req.query.season))) {
//     season = parseInt(req.query.season);
//   }

//   if (['common', 'uncommon', 'rare', 'ultra-rare', 'epic', 'legendary'].includes(req.query.cardcategory)) {
//     category = req.query.cardcategory
//   }

//   const row = db.prepare(`SELECT * FROM S${season} WHERE cardcategory = '${category}' ORDER BY RANDOM() LIMIT 1`).get();
//   res.status(200).json(row);

//   db.close();
// })

app.get('/health', async (req, res) => {
  logger.info("We live")
  res.status(200).send();
});

app.listen(port, () => {
  logger.info(`App started and listening on ${port}`)
})