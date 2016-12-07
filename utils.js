const _ = require('lodash')
function getZeroMatrix(keywords) {
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

module.exports = { getZeroMatrix }