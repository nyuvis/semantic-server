const MODELS_PATH = './models/glove'
const DEFAULT_MODEL = 'ieeevis';

const fs = require('fs');
const _ = require('lodash');
const math = require('mathjs');
const {getZeroMatrix} = require('../utils');

class Glove {
	constructor() {
		this.models = {};
	}

	getSimilarity(model, word1, word2) {
		const { W_norm, vocab, ivocab } = model;
		let vecTerm1 = W_norm[vocab[word1]];
		let VecTerm2 = W_norm[vocab[word2]];
		
		if(!vecTerm1 || !VecTerm2) {
			return null;
		}
		let dotProd = math.dot(vecTerm1, VecTerm2);
		return dotProd;
	}

	getModel(model = DEFAULT_MODEL) {
		if(this.models[model]) {
			return Promise.resolve(this.models[model]);
		} else {
			
			let vectorFile = `${MODELS_PATH}/${model}.vector.txt`;
			let vocabFile = `${MODELS_PATH}/${model}.vocab.txt`;
			let vocabData = fs.readFileSync(vocabFile).toString();
			vocabData = vocabData.split('\n').filter(d => d).map(x => x.split(' ')[0]);
			
			let vectors = {};
			let vectorData = fs.readFileSync(vectorFile).toString();
			vectorData = vectorData.split('\n');
			for(let line of vectorData) {
				let vals = line.trim().split(' ')
				vectors[vals[0]] = vals.slice(1).map(d => +d);
			}
			let vocab_size = vocabData.length;
			let vocab = {};
			let ivocab = {};
			vocabData.forEach((w, idx) => {
				vocab[w] = idx;
				ivocab[idx] = w;
			})

			let vector_dim = vectors[ivocab[0]].length;

			let W = math.zeros(vocab_size, vector_dim)
			for(let word of _.keys(vectors)){
				let v = vectors[word];
				if (word == '<unk>')
					continue;
				W._data[vocab[word]] = v
			}

			let d = W._data.map(wd => Math.sqrt(_.sum(wd.map((d) => Math.pow(d,2)))))
			let W_norm = W._data.map((wd,idx) => wd.map(k => k/d[idx]));
			this.models[model] = { W_norm, vocab, ivocab }
			return Promise.resolve(this.models[model]);
		}
	}

	getSimilarityMatrix(words, model = DEFAULT_MODEL) {
		return this.getModel(model).then(gloveModel => {
			let {matrix, index} = getZeroMatrix(words);
			for(let word1 of words) {
				let idx1 = index[word1];
				for(let word2 of words) {
					let sim = this.getSimilarity(gloveModel, word1, word2);
					
					let idx2 = index[word2];
					matrix[idx1][idx2] = sim;
				}		
			}
			return matrix;
		});
	}
}

module.exports = new Glove();



//let vectorFile = './datasets/ieevis/ieeevis_RawText.vector.txt'
//let vocabFile = './datasets/ieevis/ieeevis_RawText.vocab.txt'