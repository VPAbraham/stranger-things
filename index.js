const fetch = require('node-fetch');
const strangerUrl = 'http://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes';


// requests raw JSON data from tvmaze api
const getRawData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};

// calculates total duration of the show

const durationHelper = (data) => {
  const totalMins = data.reduce((acc, episode) => {
    return acc + episode.runtime;
  }, 0)
  return totalMins * 60;
}

// calculates average episodes per season

const avgEpisodesHelper = (data) => {
  return parseFloat((data.length / 3).toFixed(1));
}

const summaryHelper = (summaryText) => {
  if (summaryText != null) {
    const summaryLength = summaryText.indexOf('.');
    return summaryText.slice(3, summaryLength + 1)
  }
  else {
    return 'No summary found for this episode.'
  }
} 

// reformats individual epsiode data
const episodeDataHelper = (episode) => {
  const sequenceNumber = `s${episode.season}e${episode.number}`;
  const shortTitle = episode.name.split(' ').slice(2).join(' ');
  const airTimestamp = new Date(episode.airdate).valueOf();
  
  const shortSummary = summaryHelper(episode.summary);

  return {
    sequenceNumber, 
    shortTitle,
    airTimestamp,
    shortSummary
  }
}

//creates new objects for each individual episode with the appropriate data 
const episodesInfoHelper = (data) => {
  const episodeList = data.reduce((prev, current) => {
    let episodeData = episodeDataHelper(current)
    prev[current.id] = episodeData; 
    return prev;
  }, {})
  return episodeList
}
 
// combines functions to output the fully re-formatted data set.
const cleanData = async () => {
  const rawData = await getRawData(strangerUrl);
  const showId = rawData.id
  const strangerThings = {
    [showId]: {
    totalDurationSec: durationHelper(rawData._embedded.episodes),
    averageEpisodesPerSeason: avgEpisodesHelper(rawData._embedded.episodes),
    episodes: episodesInfoHelper(rawData._embedded.episodes)
  }}
  return strangerThings
}

const strangerThingsData = cleanData();
console.log(strangerThingsData)

module.exports.getRawData = getRawData;
module.exports.durationHelper = durationHelper;
module.exports.avgEpisodesHelper = avgEpisodesHelper;
module.exports.summaryHelper = summaryHelper;
module.exports.episodeDataHelper = episodeDataHelper;
module.exports.episodesInfoHelper = episodesInfoHelper;
module.exports.cleanData = cleanData; 
module.exports.strangerThingsData = strangerThingsData;