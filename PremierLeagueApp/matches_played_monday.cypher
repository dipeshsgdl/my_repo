match(m:Match)
with[item in split(m.Date,"/") | toInteger(item)] as component
with date({day:component[0],month:component[1],year:component[2]}).dayOfweek as weekDay
where weekDay=1
return count(weekDay) as Monday