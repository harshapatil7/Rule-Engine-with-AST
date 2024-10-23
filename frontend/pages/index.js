import { useState, useEffect } from 'react';
import axios from 'axios';
import RuleForm from '../components/RuleForm';
import ASTDisplay from '../components/ASTDisplay';
import EvaluationForm from '../components/EvaluationForm';

export default function Home() {
    const [rules, setRules] = useState([]);
    const [combinedAST, setCombinedAST] = useState(null);

    const addRule = async (ruleString) => {
        try {
            await axios.post('http://localhost:5000/api/rules', { ruleString });
            fetchRules();
            fetchAST();
        } catch (error) {
            alert(`Error adding rule: ${error.response?.data?.error || 'Unknown error'}`);
        }
    };

    const fetchRules = async () => {
        const response = await axios.get('http://localhost:5000/api/rules');
        setRules(response.data);
    };

    const fetchAST = async () => {
        const response = await axios.get('http://localhost:5000/api/rules/combine');
        setCombinedAST(response.data);
    };

    const deleteRule = async (id) => {
        await axios.delete(`http://localhost:5000/api/rules/${id}`);
        fetchRules();
        fetchAST();
    };

const editRule = async (id, currentRuleString) => {
    const newRuleString = prompt("Edit the rule:", currentRuleString);
    if (newRuleString) {
        // Front-end validation for "AND" and "OR"
        const modifiedRuleString = newRuleString
            .replace(/\band\b/g, 'AND') // Replace lowercase 'and' with 'AND'
            .replace(/\bor\b/g, 'OR');   // Replace lowercase 'or' with 'OR'

        // Check if the rule contains 'AND' or 'OR'
        if (!modifiedRuleString.includes('AND') && !modifiedRuleString.includes('OR')) {
            alert("Rule must contain 'AND' or 'OR'.");
            return; // Prevent the update
        }

        try {
            await axios.put(`http://localhost:5000/api/rules/${id}`, { ruleString: modifiedRuleString });
            fetchRules();
            fetchAST();
        } catch (error) {
            alert(`Error updating rule: ${error.response?.data?.error || 'Unknown error'}`);
        }
    }
};


    useEffect(() => {
        fetchRules();
        fetchAST();
    }, []);

    return (
        <div>
            <h1>Rule Engine</h1>
            <RuleForm addRule={addRule} />
            <h2>Existing Rules</h2>
            <ul>
                {rules.map((rule) => (
                    <li key={rule._id}>
                        {rule.ruleString} 
                        <button onClick={() => editRule(rule._id, rule.ruleString)}>Edit</button>
                        <button onClick={() => deleteRule(rule._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <EvaluationForm ast={combinedAST} />
            <br/>
            <ASTDisplay ast={combinedAST} />
        </div>
    );
}
