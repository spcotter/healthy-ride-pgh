library(fcd)

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

stations <- read.csv('healthyridestations2017.csv')
dim(stations)
head(stations)
tail(stations)


current_station_trips <- subset(data,
  From.station.id %in% stations$Station.. &
  To.station.id %in% stations$Station..
)

from_to_freq_table <- xtabs(~ From.station.id + To.station.id, data=current_station_trips)

from_to_freq_matrix <- matrix(
  as.numeric(unlist(from_to_freq_table)),
  nrow=nrow(from_to_freq_table)
)
from_to_p_matrix <- matrix(
  as.numeric(
    sweep(from_to_freq_matrix, 2, colSums(from_to_freq_matrix), '/')
  ),
  nrow=nrow(from_to_freq_table)
)

max_k <- 8
clusters <- NULL
for (i in seq(2,8)) {
  c <- spectral.clustering(from_to_p_matrix, K = i, adj = TRUE)
  clusters <- rbind(clusters, c)
  # print(paste(clusters[i], stations$Station.Name[i], stations$Station..[i], sep='|'))
}

clusters <- as.data.frame( t(clusters) )
names(clusters) <- paste('c', seq(2, max_k), sep='')
clusters <- cbind(stations$Station.., clusters)
names(clusters)[1] <- 'station_number'
write.csv(clusters, file='../public/clusters.csv', row.names=F)

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
