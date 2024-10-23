export default function ASTDisplay({ ast }) {
    if (!ast) return null;

    const renderNode = (node) => (
        <div style={{ margin: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <strong>{node.type}</strong>: {JSON.stringify(node.value)}
            <div style={{ marginLeft: '20px' }}>
                {node.left && (
                    <div>
                        <strong>Left</strong>
                        {renderNode(node.left)}
                    </div>
                )}
                {node.right && (
                    <div>
                        <strong>Right</strong>
                        {renderNode(node.right)}
                    </div>
                )}
            </div>
        </div>
    );

    return <div style={{ padding: '10px', border: '1px solid #000', borderRadius: '10px', backgroundColor: '#eaeaea' }}>{renderNode(ast)}</div>;
}
