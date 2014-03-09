# Music Artists in Text
The goal of this small project is to create a light language processor to find artists names (singers, music groups...) in a given text.

Want to try it? I created [a JSFiddle](http://jsfiddle.net/H6hPD/) with a demo.

## Why
I have participated in several projects that would benefit from detecting artists in a free text, and I wanted to see how to achieve this. Note that this can be extended to other datasets, like people or cities.

## How to
### Getting a list of artists
First we need a list of X artists which are rather famous and likely to be found in a text. For that, I have fetched the data for the Top 1,000 artist using The Echonest API through their "hotttnesss" value. They have a handy endpoint for search. Check out the `generate-top.js` script.

### Matching agains a text
I have been reading a lot about performant data structures to (1) store strings and (2) find if a given string exists. I have collected some URLs in the Resources section.

At the moment I am storing the list of artists as a simple array. Note that an optimized trie (see `true_1000_optim.json`) takes less amount of space that the simple array when gzipped (7kB against 8kB) and it is likely that this improves even more as more strings are included.

To perform the matching, I found out that creating one RegExp per artists, in this case 1,000, proved to have a good performance, and also provides a neat way of preventing partial string matching by using the `\b` modifier.

## Resources

### John Resig et al.
- https://github.com/jeresig/trie-js
- http://ejohn.org/blog/dictionary-lookups-in-javascript/#comment-392044
- http://ejohn.org/blog/javascript-trie-performance-analysis/
- http://stevehanov.ca/blog/index.php?id=120
- http://ejohn.org/blog/revised-javascript-dictionary-search/

### The Echonest API
- http://developer.echonest.com/docs/v4/artist.html#search