const { formatPrice } = require("../../lib/utils")
const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
  create(req, res) {
    // Pegar Categorias
    Category.all().then((results) => {
      const categories = results.rows;

      return res.render("products/create.njk", { categories })
    }).catch((err) => {
      throw new Error(err)
    })
  },
  async post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields")
      }
    }

    let results = await Product.create(req.body)
    const productId = results.rows[0].id

    return res.redirect(`products/${productId}`)
  },
  async edit(req, res) {
    let results = await Product.find(req.params.id)
    const product = results.rows[0]

    if (!product) return res.send("Product not found!")

    product.price = formatPrice(product.price)
    product.old_price = formatPrice(product.old_price)

    results = await Category.all()
    const categories = results.rows

    return res.render("products/edit.njk", { product, categories })
  },
  async put(req, res) {
    // Verificando se todos campos estão preenchidos
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields")
      }
    }
  
    // AJUSTANDO DADOS ANTES DE SALVAR NO BANCO

    // Pego o campo price e gravo no banco sem os caraceres especiais e virgulas e pontos
    req.body.price = req.body.price.replace(/\D/g, "")

    // Se tiver um old_price diferente do preço
    if (req.body.old_price != req.body.price) {
      // EU pego o produto
      const oldProduct = await Product.find(req.body.id)

      // e atualizo o valor do old_price, com o valor do price que tava (logo antes de atualizar)
      req.body.old_price = oldProduct.rows[0].price
    }

    // Atualizo o produto
    await Product.update(req.body) 

    return res.redirect(`/products/${req.body.id}/edit`)
  },
  async delete(req, res) {
    await Product.delete(req.body.id)

    return res.redirect("/products/create")
  }
}