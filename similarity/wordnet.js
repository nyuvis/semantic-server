const _ = require('lodash')
var WordNetDB = require('node-wordnet');
var wordnet = new WordNetDB();
const {getZeroMatrix} = require('../utils');

class WordNet {
	constructor() {

	}

	getSimilarityMatrix(keywords) {
		let {matrix, index} = getZeroMatrix(keywords);
		let promises = [];
		for (let i = 0; i < keywords.length; i++) {
			let promise = wordnet.lookupAsync(keywords[i]).then(function (results) {
				//similarWords = [];
				let similarWords = results.map(d => d.synonyms);
				similarWords = _.flattenDeep(similarWords);
				similarWords = similarWords.filter(function (item, index, inputArray) {
					return inputArray.indexOf(item) == index;//filtering and removing duplicate elements inside the arrays.
				});
				//console.log(similarWords);
				for (let similarWord of similarWords) {
					if (keywords.includes(similarWord))
						matrix[index[keywords[i]]][index[similarWord]] = 1;

					else continue;
				}
				matrix[index[keywords[i]]][index[keywords[i]]] = 1;
			});
			promises.push(promise);
			//console.log(promises)
		}

		return Promise.all(promises).then(r => ({ matrix, index, keywords }))
	}
}


module.exports = new WordNet();





