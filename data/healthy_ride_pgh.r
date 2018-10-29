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


from_to_freq_table <- xtabs(~ From.station.id + To.station.id, data=data)
from_to_freq_data <- as.data.frame( from_to_freq_table )
names(from_to_freq_data) <- c('from', 'to', 'freq')
dim(from_to_freq_data)

from_to_time_table <- xtabs(
  Tripduration ~ From.station.id + To.station.id,
  aggregate(Tripduration ~ From.station.id + To.station.id, data,mean)
)
from_to_time_data <- as.data.frame( from_to_time_table )
names(from_to_time_data) <- c('from', 'to', 'duration_s')
dim(from_to_time_data)

from_to_data <- merge(
  from_to_freq_data,
  from_to_time_data,
  by=c('from', 'to')
)
dim(from_to_data)

write.csv(from_to_data, file='../public/from_to_data.csv', row.names=F)
