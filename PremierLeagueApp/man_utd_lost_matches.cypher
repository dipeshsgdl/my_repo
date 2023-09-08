match ManUtdLoss=(n:Team{name:'Man United'})-[r:LOST]->(m:Match)<-[r1]-(t:Team)
return ManUtdLoss as ManchesterUnitedAllLoss