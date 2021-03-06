const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Usuario = require('../models/usuario');
const Pessoa = require('../models/pessoa');
const Compra = require('../models/compra');
const Produto = require('../models/produto');
const itemCompra = require('../models/itemCompra');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const usuarios = await Usuario.find({status: 1}).populate('pessoa');
      return res.send({ usuarios })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os usuarios'})
    }
});

router.get('/:usuarioId', async (req, res) => {
    try {
  
      const usuario = await Usuario.findById(req.params.usuarioId);

      if(usuario){
        var id_pessoa = usuario.pessoa;
        const pessoa = await Pessoa.findById(id_pessoa);
        usuario.pessoa = pessoa;
        }
  
      return res.send({ usuario })
  
    } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega o usuario'})
    }
});

router.put('/:usuarioId', async(req, res) => {

	var { email, nome, dataNascimento, telefone, endereco, cpf, permissao } = req.query
	
  if (nome === undefined){
		var { email, nome, dataNascimento, telefone, endereco, cpf, permissao } = req.body
	}
	
	try{

    const usuario = await Usuario.findByIdAndUpdate(req.params.usuarioId).select('+senha');

    if(usuario){

      const pessoa = await Pessoa.findByIdAndUpdate(usuario.pessoa);

      if(pessoa){

        pessoa.nome = nome
        pessoa.dataNascimento = dataNascimento
        pessoa.cpf = cpf
        pessoa.endereco = endereco
        pessoa.telefone = telefone.toString()

        await pessoa.save()

        usuario.permissao = permissao
        usuario.email = email

        await usuario.save()

        usuario.senha = undefined

      }else{
        return res.status(400).send({
          error: 'Falha ao editar o usuário1'
        })
      }

    }else{
      return res.status(400).send({
        error: 'Falha ao editar o usuário2'
      })
    }

		return res.send({usuario});
	
	} catch (err){
		return res.status(400).send({
			error: 'Falha ao editar o usuário'+err
		})
	}
})

router.get('/:usuarioId/compras', async (req, res) => {
  try {

    const compras = await Compra.find({usuario: req.params.usuarioId}).populate('itens_compra');
    await Promise.all(compras.map(async (compra) => {

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
    return res.status(400).send({ error: 'Erro em carrega o usuario'})
  }
});


router.delete('/:usuarioId', async (req, res) => {
  try {

    const usuario = await Usuario.findByIdAndUpdate(req.params.usuarioId).select('+senha');

    usuario.status = 0;

    await usuario.save()

    return res.send({ })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em desativar o usuário'})
  }  
});

module.exports = app => app.use('/users', router);