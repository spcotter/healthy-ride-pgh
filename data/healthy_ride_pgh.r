setwd('~/GitHub/healthy-ride-pgh/data')
csvs <- list.files(pattern = '-q\\d.csv$')

data <- NULL
for (c in csvs) {
  data <- rbind(
    data,
    read.csv(c)
  )
}

dim(data)
head(data)
tail(data)


from_to_table <- xtabs(~ From.station.id + To.station.id, data=data)
write.csv(from_to_table, file='from_to_table.csv')

from_to_data <- as.data.frame( from_to_table )
write.csv(from_to_data, file='../public/from_to_data.csv', row.names=F)