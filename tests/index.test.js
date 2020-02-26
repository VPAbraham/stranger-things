// sample datasets
const episodeData = require('../sample_data/episodeData');

// script functions
const { 
  durationHelper, 
  avgEpisodesHelper, 
  summaryHelper, 
  episodeDataHelper,
  episodesInfoHelper
} = require('../index');

// mock helpers
const fetchMock = require('fetch-mock');


describe('Stranger Things JSON script', () => {
  describe('getRawData', () => {
    it('should fetch the S.T. JSON data and return the episodes', async () => {
      fetchMock.get('http://fakeUrl.com', {name: 'Stranger Things', _embedded: 
        {episodes:[{name: 'Chapter One'}]}
      });

      const mockResponse = await fetch('http://fakeUrl.com');
      const mockData = await mockResponse.json();
      const mockResult = mockData._embedded;

      expect(mockResult.episodes).toEqual([{name: 'Chapter One'}]);
    });

  });

  describe('durationHelper function', () => {
    it('should be able to calculate total series length in seconds from runtime, in minutes', () => {
      const input = [
        {"id": 553946, "runtime": 60},
        {"id": 578663, "runtime": 60},
        {"id": 578664, "runtime": 100},
        {"id": 578669, "runtime": 45}
          ]

      const output = 15900;

      expect(durationHelper(input)).toEqual(output)
    });
  });

  describe('avgEpisodesHelper function', () => {
    it('should be able to calculate average number of episodes per season', () => {
      const input = [
        {"id": 553946, "season": 1},
        {"id": 553946, "season": 2},
        {"id": 553946, "season": 3},
        {"id": 553946, "season": 3},
        {"id": 553946, "season": 2},
        {"id": 553946, "season": 2},
        {"id": 553946, "season": 1},
        {"id": 553946, "season": 1},
        {"id": 553946, "season": 3},
        {"id": 553946, "season": 2},
        {"id": 553946, "season": 2},
      ]

      const output = 3.7

      expect(avgEpisodesHelper(input)).toEqual(output)
    });
  });

  describe('summaryHelper function', () => {
    it('should return only the first sentence of the given episode summary and trim off <p> tags', () => {
      input = '<p>Things change over the summer: Jonathan, Nancy, Steve, and Billy get jobs; Dustin goes to science camp; El and Mike become an item; Lucas and Max almost become an item. Meanwhile, mysterious power outages plague Hawkins and rats start exploding.</p>'

      output = 'Things change over the summer: Jonathan, Nancy, Steve, and Billy get jobs; Dustin goes to science camp; El and Mike become an item; Lucas and Max almost become an item.'

      expect(summaryHelper(input)).toEqual(output);
    });
  });

  describe('episodeDataHelper function', () => {
    it('should return a modifed version of the inidividual episode data', () => {
      input = {
        "id": 909349,
        "url": "http://www.tvmaze.com/episodes/909349/stranger-things-2x09-chapter-nine-the-gate",
        "name": "Chapter Nine: The Gate",
        "season": 2,
        "number": 9,
        "airdate": "2017-10-27",
        "airtime": "",
        "airstamp": "2017-10-27T12:00:00+00:00",
        "runtime": 60,
        "image": {
            "medium": "http://static.tvmaze.com/uploads/images/medium_landscape/132/332064.jpg",
            "original": "http://static.tvmaze.com/uploads/images/original_untouched/132/332064.jpg"
        },
        "summary": "<p>The group splits up to close the gate, evict the Mind Flayer from Will, and drive the demo-dogs away from Hawkins Lab.</p>",
        "_links": {
            "self": {
                "href": "http://api.tvmaze.com/episodes/909349"
            }
        }
      }

      output = {
        "airTimestamp": 1509062400000,
        "sequenceNumber": "s2e9",
        "shortSummary": "The group splits up to close the gate, evict the Mind Flayer from Will, and drive the demo-dogs away from Hawkins Lab.",
        "shortTitle": "The Gate"
      }

      expect(episodeDataHelper(input)).toEqual(output)
    });
  });

  describe('episodesInfoHelper function', () => {
    it('should convert an array of episodes to modified object of the same episodes', () => {

      input = episodeData.episodeData;

      output = {
        '553946': {
          sequenceNumber: 's1e1',
          shortTitle: 'The Vanishing of Will Byers',
          airTimestamp: 1468540800000,
          shortSummary: 'A young boy mysteriously disappears, and his panicked mother demands that the police find him.'
        },
        '578663': {
          sequenceNumber: 's1e2',
          shortTitle: 'The Weirdo on Maple Street',
          airTimestamp: 1468540800000,
          shortSummary: 'While the search for the missing Will continues, Joyce tells Jim about a call she apparently received from her son.'
        },
        '578664': {
          sequenceNumber: 's1e3',
          shortTitle: 'Holly, Jolly',
          airTimestamp: 1468540800000,
          shortSummary: 'While Nancy looks for a missing Barbara and realizes that Jonathan may have been the last person to see her, Mike and his friends go out with Jane to find the missing Will.'
        },
        '578665': {
          sequenceNumber: 's1e4',
          shortTitle: 'The Body',
          airTimestamp: 1468540800000,
          shortSummary: "Jim realizes that the government is covering something up about Will's death and begins a personal investigation."
        }
      }

      expect(episodesInfoHelper(input)).toEqual(output)
    });
  });
});