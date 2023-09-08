match LivWinatFT=(n:Team{name:'Liverpool'})-[r:WON]->(m:Match)<-[r1]-(t:Team)
where r.goalsScoredHT<r1.goalsScoredHT
return LivWinatFT as LiverpoolLosingAtHtWonAtFT