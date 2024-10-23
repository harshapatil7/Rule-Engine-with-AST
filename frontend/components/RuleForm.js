import { useState } from 'react';

export default function RuleForm({ addRule }) {
    const [ruleString, setRuleString] = useState('');
    const [error, setError] = useState(''); // State to hold error messages

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Front-end validation for "AND" and "OR"
        const modifiedRuleString = ruleString
            .replace(/\band\b/g, 'AND') // Replace lowercase 'and' with 'AND'
            .replace(/\bor\b/g, 'OR'); // Replace lowercase 'or' with 'OR'

        // Check if the rule contains 'AND' or 'OR'
        if (!modifiedRuleString.includes('AND') && !modifiedRuleString.includes('OR')) {
            setError("Rule must contain 'AND' or 'OR'.");
            return; // Prevent form submission
        }

        try {
            // Attempt to add the rule
            await addRule(modifiedRuleString);
            setRuleString(''); // Clear input on successful submission
            setError(''); // Clear any previous error messages
        } catch (err) {
            // Handle validation error
            setError(err.message); // Set error message from the backend
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={ruleString}
                onChange={(e) => setRuleString(e.target.value)}
                placeholder="Enter rule"
                required
            />
            <button type="submit">Add Rule</button>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>} {/* Display error message */}
        </form>
    );
}
