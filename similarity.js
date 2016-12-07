const wordnet = require('./similarity/wordnet')
const glove = require('./similarity/glove') 

function getDistanceMatrix(keywords, method) {
	//I will return the distance matrix
	//console.log("Don't worry is working")
	switch (method) {
		case 'WordNet':
			return wordnet.getSimilarityMatrix(keywords);
		case 'Glove':
			return glove.getSimilarityMatrix(keywords);

		default:
			return Promise.resolve(keywords);
	}
}

module.exports = getDistanceMatrix
