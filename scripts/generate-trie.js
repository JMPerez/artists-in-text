var fs = require('fs');

fs.readFile('../data/output_1000.json', function(err, data) {
  if (err) throw err;

  var artists = JSON.parse(data);

  var trie = {};

  // Go through all the artists in the dictionary
  for ( var i = 0, l = artists.length; i < l; i++ ) {
      // Get all the letters that we need
      var artist = artists[i].toLowerCase(), letters = artist.split(""), cur = trie;
   
      // Loop through the letters
      for ( var j = 0; j < letters.length; j++ ) {
          var letter = letters[j], pos = cur[ letter ];
   
          // If nothing exists for this letter, create a leaf
          if ( pos == null ) {
              // If it's the end of the artist name, set a 0,
              // otherwise make an object so we can continue
              cur = cur[ letter ] = j === letters.length - 1 ? 0 : {};
         
          // If a final leaf already exists we need to turn it
          // into an object to continue traversing
          } else if ( pos === 0 ) {
              cur = cur[ letter ] = { $: 0 };
   
          // Otherwise there is nothing to be set, so continue on
          } else {
              cur = cur[ letter ];
          }
      }
  }

  function optimize( cur ) {
    var num = 0, last;

    for ( var node in cur ) {
      if ( typeof cur[ node ] === "object" ) {
        var ret = optimize( cur[ node ] );

        if ( ret ) {
          delete cur[ node ];
          cur[ node + ret.name ] = ret.value;
          node = node + ret.name;
        }
      }

      last = node;
      num++;
    }

    if ( num === 1 ) {
      return { name: last, value: cur[ last ] };
    }
  }

  optimize(trie);
  console.log(JSON.stringify(trie));

});

