const express = require('express');
const router = express.Router();
const { addRule, getCombinedRules, evaluateRule, getRules, deleteRule, updateRule } = require('../controllers/ruleController');

router.post('/', addRule);
router.get('/', getRules); // Get all rules
router.delete('/:id', deleteRule); // Delete a rule by ID
router.put('/:id', updateRule); // Update a rule by ID
router.get('/combine', getCombinedRules);
router.post('/evaluate', evaluateRule);

module.exports = router;
