// note: The echonest API has a limit of 20 requests per minute

var http = require('http');
var Q = require('q');
var apiKey = '<here_your_key>';

// note: there is a limit in 1,000 results. This can be exceeded by adding
// filters like maxhottnesss set to the hottnesss value of the 1,000th result
// but The echonest returns values that have a higher hottnesss value.
// thus, we'd need to check that there are no duplicates
var amountArtists = 1000;

var results = [],
    names = [];

function getTopArtist(start, amount) {
  var deferred = Q.defer();

  if (start === undefined) {
    start = 0;
  }

  var options = {
    hostname: 'developer.echonest.com',
    path: '/api/v4/artist/search?api_key=' + apiKey + '&format=json&results=' + amount + '&start=' + start + '&bucket=hotttnesss&sort=hotttnesss-desc'
  };

  var callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been received, so we just print it out here
    response.on('end', function () {
      //console.log(str);
      var json = JSON.parse(str);
      if (json.response.status.code === 0) {
        deferred.resolve(json.response.artists);
      } else {
        deferred.reject(new Error(json.response.status.code));
      }
    });
  };

  var req = http.request(options, callback);
  req.on('error', function(e) {
    //console.log('problem with request: ' + e.message);
    deferred.reject(new Error(e));
  });

  setTimeout(function() {
    req.end();
  }, (parseInt(start / 100, 10) * 3000)); // we make one request every 3s (20 per minute)

  return deferred.promise;
}

var promises = [];
for (var i = 0; i < amountArtists; i += 100) {
  promises.push(getTopArtist(i, (amountArtists - i > 100 ? 100 : amountArtists - i)));
}

var allPromise = Q.all(promises)
  .then(function(partialResults) {
    partialResults.forEach(function(partialResult) {
      results = results.concat(partialResult);
      names = results.map(function(result) {
        return result.name;
      });
    });

    console.log(JSON.stringify(names));
  }, console.error);