match(t:Team)-[r:WON|DRAW]->(m:Match)
with collect(type(r)) as matchResult,t.name as teamName
with reduce (data={points:0,teamName:teamName},rel in matchResult|
//WIN
case when rel="WON"
then{
    //increase points by 3
    points:data.points+3
}
else{
    //increase points by 1
    points:data.points+1
}
end
) as result,teamName
//make list from array(result.points)
unwind result.points as points
return teamName as Team,points as Points
order by points desc