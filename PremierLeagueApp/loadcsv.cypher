LOAD CSV with headers FROM "file:///epl_Dataset.csv" AS line
MERGE
(m:Match{Date:line.Date,
homeTeam:line.HomeTeam,
awayTeam:line.AwayTeam,
fullTimeHomeGoals:line.FTHG,
fullTimeAwayGoals:line.FTAG,
fullTimeResult:line.FTR,
halfTimeHomeGoals:line.HTHG,
halfTimeAwayGoals:line.HTAG,
halfTimeResult:line.HTR
})
WITH line AS line, m AS m
MERGE (t1:Team{name: line.HomeTeam})
MERGE (t2:Team{name: line.AwayTeam})
WITH toInteger(line.FTHG) AS goalsScoredFTHome,
toInteger(line.HTHG) AS goalsScoredHTHome,
toInteger(line.FTAG) AS goalsScoredFTAway,
toInteger(line.HTAG) AS goalsScoredHTAway,m AS m , t1 AS t1, t2 AS t2

FOREACH(line IN CASE WHEN (goalsScoredFTHome > goalsScoredFTAway) THEN [1] ELSE [] END | 
MERGE (t1)-[r1:WON{ goalsScoredFT: goalsScoredFTHome, goalsScoredHT:goalsScoredHTHome}]-
>(m)<-[r2:LOST{goalsScoredFT: goalsScoredFTAway, goalsScoredHT:goalsScoredHTAway}]-(t2))

FOREACH(line IN CASE WHEN (goalsScoredFTHome = goalsScoredFTAway) THEN [1] ELSE [] END
|MERGE (t1)-[r1:DRAW{ goalsScoredFT: goalsScoredFTHome,goalsScoredHT:goalsScoredHTHome}]-
>(m)<-[r2:DRAW{goalsScoredFT:goalsScoredFTAway, goalsScoredHT:goalsScoredHTAway}]-(t2))

FOREACH(line IN CASE WHEN (goalsScoredFTHome < goalsScoredFTAway) THEN [1] ELSE [] END
|MERGE (t1)-[r1:LOST{goalsScoredFT: goalsScoredFTHome, goalsScoredHT: goalsScoredHTHome}]-
>(m)<-[r2:WON{goalsScoredFT: goalsScoredFTAway, goalsScoredHT: goalsScoredHTAway}]-(t2))
