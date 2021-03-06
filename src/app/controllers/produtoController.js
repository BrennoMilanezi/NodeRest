const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Produto = require('../models/produto');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const produtos = await Produto.find();
      return res.send({ produtos })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os produtos'})
    }
});

router.post('/', async (req, res) => {

    var { nome, qtdEstoque, preco } = req.query
	
    if (nome === undefined){
		var { nome, qtdEstoque, preco } = req.body
	}

    try{

		const produto = await Produto.create({ nome, qtdEstoque, preco })
      
        await produto.save()

        return res.send({ produto })

	} catch (err){
		return res.status(400).send({
			error: 'Falha no registro'
		})
	}
    
});

module.exports = app => app.use('/produtos', router);