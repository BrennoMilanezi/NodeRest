const mongoose = require('../../database');

const CompraSchema = new mongoose.Schema({
	usuario: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuario',
	},
	itens_compra: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'itemCompra',
		default: []
	}],
    total: {
		type: Number,
		required: true,
		default: 0
	},
	status: {
		type: Number,
		default: 1 // 0 - Cancelada, 1 - Ativa, 2 - Finalizada
	}
})

const Compra = mongoose.model('Compra', CompraSchema);

module.exports = Compra;