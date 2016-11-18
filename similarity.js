var _ = require('lodash')
var WordNet = require('node-wordnet');
var wordnet = new WordNet();

function getDistanceMatrix(keywords, method) {
	//I will return the distance matrix
	//console.log("Don't worry is working")
	switch (method) {
		case 'WordNet':
			return getSimilarityMatrixWordNet(keywords, method);

		default:
			return Promise.resolve(keywords);
	}
}
//this function is going to create a matrix with all zeros for each element in each row
function getZeroMetrix(keywords) {
	//console.log(keywords.key);
	let matrix = [];
	let index = {};

	for(let i=0; i<keywords.length;i++){
		var aux = [];
		aux = _.times(keywords.length, _.constant(0));
		matrix.push(aux);
		index[keywords[i]] = i;
	}
	//console.log(index)
	return {matrix, index}
}

function getSimilarityMatrixWordNet(keywords, method) {
	let {matrix, index} = getZeroMetrix(keywords);
	let promises = [];

	for(let i=0; i<keywords.length;i++){
		let promise = wordnet.lookupAsync(keywords[i]).then(function(results){
				//similarWords = [];
				let similarWords = results.map(d => d.synonyms);
				similarWords = _.flattenDeep(similarWords);
				similarWords = similarWords.filter( function( item, index, inputArray ) {
						return inputArray.indexOf(item) == index;//filtering and removing duplicate elements inside the arrays.
    				});
				//console.log(similarWords);
				for(let similarWord of similarWords){
					if(keywords.includes(similarWord))
						matrix[index[keywords[i]]][index[similarWord]] = 1 ;
					else continue;
				 }
	});
		promises.push(promise);
		//console.log(promises)
	}

	return Promise.all(promises).then(r => ({matrix, index, keywords}))
}

module.exports = getDistanceMatrix
