import { useState } from 'react';
import axios from 'axios';

export default function EvaluationForm({ ast }) {
    const [jsonInput, setJsonInput] = useState(''); // State to store the JSON input from the user
    const [error, setError] = useState(''); // State for any errors in input
    const [result, setResult] = useState(null);

    const handleEvaluate = async () => {
        try {
            const data = JSON.parse(jsonInput); // Parse the JSON input
            const response = await axios.post('http://localhost:5000/api/rules/evaluate', { ast, data });
            setResult(response.data.result);
            setError(''); // Clear error on success
        } catch (err) {
            // Handle JSON parsing or backend error
            setError('Invalid JSON input or server error');
        }
    };

    return (
        <div>
            <h2>Evaluate Rule</h2>
            {ast && (
                <div>
                    <textarea
                        placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 3}'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows="8"
                        cols="50"
                    />
                    <button onClick={handleEvaluate}>Evaluate</button>
                </div>
            )}
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            {result !== null && <div>Evaluation Result: {result ? 'True' : 'False'}</div>}
        </div>
    );
}
