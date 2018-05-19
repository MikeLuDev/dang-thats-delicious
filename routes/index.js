const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const michael = { name: 'Michael', age: 24, cool: true };
  res.send(req.query);
});

module.exports = router;
