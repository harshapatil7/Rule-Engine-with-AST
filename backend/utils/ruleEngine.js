class Node {
    constructor(nodeType, left = null, right = null, value = null) {
        this.type = nodeType; // "operator" for AND/OR, "operand" for conditions
        this.left = left;     // Left child node
        this.right = right;   // Right child node
        this.value = value;   // Condition value for operand nodes
    }

    toString() {
        if (this.type === "operand") {
            return `${this.value}`;
        }
        return `(${this.left} ${this.value} ${this.right})`;
    }
}

class RuleEngine {
    constructor() {
        this.operators = { "AND": 1, "OR": 0 }; // Operator precedence
    }

    precedence(op) {
        return this.operators[op];
    }

    parseOperand(condition) {
        return new Node("operand", null, null, condition.trim());
    }

    parseOperator(op) {
        return new Node("operator", null, null, op);
    }

    applyOperator(operators, operands) {
        let operator = operators.pop();
        let right = operands.pop();
        let left = operands.pop();
        operands.push(new Node("operator", left, right, operator.value));
    }   

    validateCondition(condition) {
        // Check for a valid condition format
        const match = condition.match(/(\w+)\s*([<>=!]+)\s*(.+)/);
        if (!match) {
            throw new Error(`Invalid condition format: "${condition}". Expected format: <attribute> <operator> <value> Example: age > 30 `);
        }
        
        const [, attribute, operator, value] = match;
        
        // Check if the operator is valid
        const validOperators = ['>', '<', '>=', '<=', '=', '!='];
        if (!validOperators.includes(operator)) {
            throw new Error(`Unsupported operator: "${operator}". Expected one of ${validOperators.join(', ')}`);
        }

        return true; // Return true if the condition is valid
    }

    create_rule(ruleString) {
        // Split tokens while preserving parentheses and operators
        let tokens = ruleString.split(/(\s*AND\s*|\s*OR\s*|\(|\))/).filter(t => t.trim());
        console.log(tokens)

        let operands = [];
        let operators = [];
    
        tokens.forEach(token => {
            token = token.trim(); // Trim whitespace
            
            if (token === '(') {
                operators.push(token);
            } else if (token === ')') {
                while (operators.length && operators[operators.length - 1] !== '(') {
                    this.applyOperator(operators, operands);
                }
                operators.pop(); // Remove '('
            } else if (this.operators.hasOwnProperty(token)) {
                while (operators.length && operators[operators.length - 1] !== '(' &&
                       this.precedence(operators[operators.length - 1].value) >= this.precedence(token)) {
                    this.applyOperator(operators, operands);
                }
                operators.push(this.parseOperator(token));
            } else {
                // Only add as an operand if it looks like a valid condition
                if (token) {
                    this.validateCondition(token); // Validate condition here
                    operands.push(this.parseOperand(token));
                }
            }
        });
    
        // Apply remaining operators
        while (operators.length) {
            this.applyOperator(operators, operands);
        }
    
        return operands.length ? operands[0] : null;
    }
    

    countOperators(ruleString) {
        let andCount = (ruleString.match(/AND/g) || []).length;
        let orCount = (ruleString.match(/OR/g) || []).length;
        return { andCount, orCount };
    }

    combine_rules(ruleStrings) {
        let astNodes = ruleStrings.map(rule => this.create_rule(rule));
        if (!astNodes.length) return null;

        let totalAndCount = 0, totalOrCount = 0;

        ruleStrings.forEach(rule => {
            let { andCount, orCount } = this.countOperators(rule);
            totalAndCount += andCount;
            totalOrCount += orCount;
        });

        console.log(totalAndCount, totalOrCount);

        // Choose the most frequent operator
        let mostFrequentOperator = (totalAndCount >= totalOrCount) ? "AND" : "OR";

        // Combine all rules using the most frequent operator
        let combinedAST = astNodes[0];
        for (let i = 1; i < astNodes.length; i++) {
            combinedAST = new Node("operator", combinedAST, astNodes[i], mostFrequentOperator);
        }
        // console.log("Combined AST:", JSON.stringify(combinedAST, null, 2));
        function printAST(node, level = 0) {
            if (!node) return;
            let indent = ' '.repeat(level * 4);
        
            // Print the current node's details
            if (node.type === "operator") {
                console.log(`${indent}Operator: ${node.value}`);
            } else if (node.type === "operand") {
                console.log(`${indent}Operand: ${node.value}`);
            }
        
            // Recursively print the left and right children
            if (node.left) {
                console.log(`${indent}Left:`);
                printAST(node.left, level + 1);
            }
            if (node.right) {
                console.log(`${indent}Right:`);
                printAST(node.right, level + 1);
            }
        }
        
        // Print the combined AST
        printAST(combinedAST);
        return combinedAST;
    }

    evaluate_rule(ast, data) {
        if (!ast) return false;

        if (ast.type === "operand") {
            const [attribute, op, value] = this.parseCondition(ast.value);
            return this.evaluateCondition(data[attribute], op, value);
        }

        const leftEval = this.evaluate_rule(ast.left, data);
        const rightEval = this.evaluate_rule(ast.right, data);

        if (ast.value === "AND") {
            return leftEval && rightEval;
        } else if (ast.value === "OR") {
            return leftEval || rightEval;
        }
        return false;
    }

    parseCondition(condition) {
        // Adjusted regex to capture <= and >=
        const match = condition.match(/(\w+)\s*([<>=!]+)\s*(.+)/);
        if (!match) throw new Error("Invalid condition format");

        const [, attribute, operator, value] = match;

        // Handle potential numerical values by attempting to convert them
        const parsedValue = isNaN(value) ? value.replace(/'/g, '').trim() : Number(value);

        return [attribute, operator, parsedValue];
    }

    evaluateCondition(attributeValue, operator, value) {
        // Handle the additional operators and adjust for types
        switch (operator) {
            case '>': return attributeValue > value;
            case '<': return attributeValue < value;
            case '>=': return attributeValue >= value; // Added support for >=
            case '<=': return attributeValue <= value; // Added support for <=
            case '=': return attributeValue === value;
            case '!=': return attributeValue !== value;
            default: throw new Error("Unsupported operator");
        }
    }
}

// Export functions
module.exports = new RuleEngine();
