const Rule = require('../models/Rule');
// const { create_rule, combine_rules, evaluate_rule } = require('../utils/ruleEngine');
const RuleEngine = require('../utils/ruleEngine');

exports.addRule = async (req, res) => {
    let { ruleString } = req.body;

    // Trim the rule string to remove unnecessary whitespace
    ruleString = ruleString.trim();

    // Remove leading and trailing quotation marks if they exist
    if (ruleString.startsWith('"') && ruleString.endsWith('"')) {
        ruleString = ruleString.slice(1, -1);
    }

    // Validate ruleString is not empty
    if (!ruleString) {
        return res.status(400).json({ error: "Rule string cannot be empty." }); // Return a 400 Bad Request
    }

    try {
        const ast = RuleEngine.create_rule(ruleString); // This should throw an error if invalid
        console.log(ast, ruleString);

        // Create a new Rule document
        const newRule = new Rule({ ruleString, ast });
        await newRule.save(); // Save to the database
        console.log("Rule created successfully");

        // Respond with the created rule
        res.status(201).json(newRule);
    } catch (error) {
        console.error("Error creating rule:", error.message); // Log the error
        res.status(400).json({ error: error.message }); // Return a 400 Bad Request
    }
};

exports.getRules = async (req, res) => {
    const rules = await Rule.find();
    res.json(rules); // Return all rules
};

exports.deleteRule = async (req, res) => {
    const { id } = req.params;
    await Rule.findByIdAndDelete(id);
    res.status(204).send(); // No content to send back
};

exports.getCombinedRules = async (req, res) => {
    const rules = await Rule.find();
    const ruleStrings = rules.map(rule => rule.ruleString);
    const combinedAST = RuleEngine.combine_rules(ruleStrings);
    res.json(combinedAST);
};

exports.evaluateRule = (req, res) => {
    const { ast, data } = req.body;
    const result = RuleEngine.evaluate_rule(ast, data);
    res.json({ result });
};

exports.updateRule = async (req, res) => {
    const { id } = req.params;
    const { ruleString } = req.body;

    try {
        const ast = RuleEngine.create_rule(ruleString);
        const updatedRule = await Rule.findByIdAndUpdate(id, { ruleString, ast }, { new: true });
        res.json(updatedRule);
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return a 400 Bad Request
    }
};