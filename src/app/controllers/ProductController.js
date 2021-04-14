const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
  create(req, res) {
    // Result {
    //   command: 'INSERT',
    //   rowCount: 1,
    //   oid: 0,
    //   rows: [ { id: 10 } ],
    //   fields: [
    //     Field {
    //       name: 'id',
    //       tableID: 16547,
    //       columnID: 1,
    //       dataTypeID: 23,
    //       dataTypeSize: 4,
    //       dataTypeModifier: -1,
    //       format: 'text'
    //     }
    //   ],
    //   _parsers: [ [Function: parseInteger] ],
    //   _types: TypeOverrides {
    //     _types: {
    //       getTypeParser: [Function: getTypeParser],
    //       setTypeParser: [Function: setTypeParser],
    //       arrayParser: [Object],
    //       builtins: [Object]
    //     },
    //     text: {},
    //     binary: {}
    //   },
    //   RowCtor: null,
    //   rowAsArray: false
    // }
    // Pegar Categorias

    // Fez o Category.all (promise)? Então faz essa função!
    // Resultado da promisse nesse caso aquele objeto Result
    // atribuo as categorias ao rows do objeto result
    // renderizo a pagina create, mandando a const categories
    Category.all().then((results) => {
      console.log(results)
      const categories = results.rows;

      return res.render("products/create.njk", { categories })
    }).catch((err) => {
      throw new Error(err)
    })

  },
  async post(req, res) {
    // Logica de salvar
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields")
      }
    }

    let results = await Product.create(req.body)
    console.log(results)
    const productId = results.rows[0].id

    results = await Category.all()
    const categories = results.rows

    return res.render("products/create.njk", { productId, categories })
  }
}