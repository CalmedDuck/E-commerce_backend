const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Get all categories
router.get('/', (req, res) => {
  Category.findAll({
    include: [{ model: Product }]
  })
  .then(categories => res.json(categories))
  .catch(err => res.status(500).json(err));
});

// Get one category by its ID
router.get('/:id', (req, res) => {
  Category.findOne({
    where: { id: req.params.id },
    include: [{ model: Product }]
  })
  .then(category => {
    if (!category) {
      res.status(404).json({ message: 'No category found with this ID' });
      return;
    }
    res.json(category);
  })
  .catch(err => res.status(500).json(err));
});

// Create a new category
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
  .then(category => res.json(category))
  .catch(err => res.status(400).json(err));
});

// Update a category by its ID
router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: { id: req.params.id }
  })
  .then(category => {
    if (!category) {
      res.status(404).json({ message: 'No category found with this ID' });
      return;
    }
    res.json(category);
  })
  .catch(err => res.status(500).json(err));
});

// Delete one category by its ID
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: { id: req.params.id }
  })
  .then(categoryData => {
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this ID' });
      return;
    }
    res.json(categoryData);
  })
  .catch(err => res.status(500).json(err));
});

module.exports = router;
