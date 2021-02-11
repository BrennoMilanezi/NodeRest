const mongoose = require('../../database');

const ProdutoSchema = new mongoose.Schema({
	nome: {
		type: String,
		required: true,
	},
    preco: {
		type: Number,
		required: true,
	},
    qtdEstoque: {
		type: Number,
		required: true,
	},
	status: {
		type: Number,
		default: 1
	}
})

const Produto = mongoose.model('Produto', ProdutoSchema);

module.exports = Produto;