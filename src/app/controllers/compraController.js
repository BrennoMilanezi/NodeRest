const express = require('express');
const authMiddleware = require('../middlewares/auth');

const itemCompra = require('../models/itemCompra');
const Usuario = require('../models/usuario');
const Pessoa = require('../models/pessoa');
const Compra = require('../models/compra');
const Produto = require('../models/produto');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const compras = await Compra.find().populate('usuario', 'itens_compra');
      await Promise.all(compras.map(async (compra, index) => {

        var id_usuario = compra.usuario;
        const usuario = await Usuario.findById(id_usuario);
        compra.usuario = usuario;

        var id_pessoa = compra.usuario.pessoa;
        const pessoa = await Pessoa.findById(id_pessoa);
        compra.usuario.pessoa = pessoa;

        await Promise.all(compra.itens_compra.map(async (item, index) => {
            const item_compra = await itemCompra.findById(item);
            if(item_compra){
                const produto = await Produto.findById(item_compra.produto);
                item_compra.produto = produto
                compra.itens_compra[index] = item_compra;
            }
        }));

      }));
      return res.send({ compras })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar as compras'})
    }
});

router.post('/', async (req, res) => {

    var { produto, qtd, preco } = req.query
	
    if (produto === undefined){
		var { produto, qtd, preco } = req.body
	}

    try{

        const produto_ex = await Produto.findById(produto)
        if(!produto_ex){
            return res.status(400).send({ error: 'Erro em criar a comrpa'})
        }

		const compra = await Compra.findOne({usuario: req.usuarioId, status: 1})
        if(compra){

            const item = await itemCompra.findOne({compra: compra._id, produto: produto_ex._id})

            if(item){
                item.qtd = item.qtd + qtd
                item.preco = item.preco + preco
                await item.save()
            }else{
                const item = new itemCompra({compra: compra._id, produto: produto_ex._id, qtd: qtd, preco: preco})
                await item.save()
                var total = compra.total + preco
                compra.total = total
                compra.itens_compra.push(item._id)
                await compra.save()
            }

		}else{

            const compra = await Compra.create({ usuario: req.usuarioId });
            
            const item = new itemCompra({compra: compra._id, produto: produto_ex._id, qtd: qtd, preco: preco})
   
            await item.save()

            var total = compra.total + preco
            compra.total = total
            compra.itens_compra.push(item._id)
            await compra.save()
        }

        produto_ex.qtdEstoque = produto_ex.qtdEstoque - qtd
        await produto_ex.save()

        var id_pessoa = compra.usuario.pessoa;
        const pessoa = await Pessoa.findById(id_pessoa);
        compra.usuario.pessoa = pessoa;

        await Promise.all(compra.itens_compra.map(async (item, index) => {
            const item_compra = await itemCompra.findById(item);
            if(item_compra){
                const produto = await Produto.findById(item_compra.produto);
                item_compra.produto = produto
                compra.itens_compra[index] = item_compra;
            }
        }));

        return res.send({ compra })

	} catch (err){
		return res.status(400).send({
			error: 'Falha no registro'+err
		})
	}
    
});

module.exports = app => app.use('/compras', router);