const mongoose = require('../../database');

const itemCompraSchema = new mongoose.Schema({
	compra: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Compra',
	},
    produto: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Produto',
	},
    qtd: {
		type: Number,
		required: true,
	},
    preco: {
		type: Number,
		required: true,
	},
})

const itemCompra = mongoose.model('itemCompra', itemCompraSchema);

module.exports = itemCompra;