const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      { model: Category },
      { model: Tag, through: ProductTag }
    ]
  })
  .then(products => res.json(products))
  .catch(err => res.status(500).json(err));
});

// Get one product by its ID
router.get('/:id', (req, res) => {
  Product.findOne({
    where: { id: req.params.id },
    include: [
      { model: Category },
      { model: Tag, through: ProductTag }
    ]
  })
  .then(product => {
    if (!product) {
      res.status(404).json({ message: 'No product found with this ID' });
      return;
    }
    res.json(product);
  })
  .catch(err => res.status(500).json(err));
});

// Existing route for creating a new product remains unchanged.
// POST route for creating a new product
router.post('/', (req, res) => {
  // Create a new product with the data available in req.body
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds // Assuming you're passing an array of tag IDs
  })
  .then((product) => {
    // If there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // If no product tags, just respond
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// Update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then(product => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then(productTags => {
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds.filter(
      tag_id => !productTagIds.includes(tag_id)
    ).map(tag_id => {
      return {
        product_id: req.params.id,
        tag_id,
      };
    });

    const productTagsToRemove = productTags.filter(
      ({ tag_id }) => !req.body.tagIds.includes(tag_id)
    ).map(({ id }) => id);

    return Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
  })
  .then(updatedProductTags => res.json(updatedProductTags))
  .catch(err => res.status(400).json(err));
});

// Delete one product by its ID
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: { id: req.params.id }
  })
  .then(productData => {
    if (!productData) {
      res.status(404).json({ message: 'No product found with this ID' });
      return;
    }
    res.json(productData);
  })
  .catch(err => res.status(500).json(err));
});

module.exports = router;
