const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Get all tags
router.get('/', (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag
      }
    ]
  })
  .then(tags => res.json(tags))
  .catch(err => res.status(500).json(err));
});

// Get a single tag by its ID
router.get('/:id', (req, res) => {
  Tag.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Product,
        through: ProductTag
      }
    ]
  })
  .then(tag => {
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this ID' });
      return;
    }
    res.json(tag);
  })
  .catch(err => res.status(500).json(err));
});

// Create a new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
    .then(tag => res.json(tag))
    .catch(err => res.status(500).json(err));
});

// Update a tag's name by its ID
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: { id: req.params.id }
  })
  .then(tag => {
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this ID' });
      return;
    }
    res.json(tag);
  })
  .catch(err => res.status(500).json(err));
});

// Delete a tag by its ID
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: { id: req.params.id }
  })
  .then(tagData => {
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this ID' });
      return;
    }
    res.json(tagData);
  })
  .catch(err => res.status(500).json(err));
});

module.exports = router;
