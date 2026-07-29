const vscode = require('vscode');

function activate(context) {
    // Option 1: Convert $x^2$ to $`x^2`$
    let convertToBacktick = vscode.commands.registerCommand('InlineMath.backtick', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const document = editor.document;
        const text = document.getText();

        // Replaces inline $math$ with $`math`$, skipping $$ block math and existing $`math`$
        const updatedText = text.replace(/(?<!\$)\$([^$`\n]+)\$(?!\$)/g, '$`$1`$');

        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );
        await editor.edit(editBuilder => editBuilder.replace(fullRange, updatedText));
    });

    // Option 2: Convert $`x^2`$ to $$
    let convertToBlock = vscode.commands.registerCommand('InlineMath.unbacktick', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const document = editor.document;
        const text = document.getText();

        // Replaces inline $`math`$ with block $$ math $$
        const updatedText = text.replace(/\$`([^`\n]+)`\$/g, '$$\n$1\n$$');

        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );
        await editor.edit(editBuilder => editBuilder.replace(fullRange, updatedText));
    });

    context.subscriptions.push(convertToBacktick, convertToBlock);
}

function deactivate() { }

module.exports = { activate, deactivate };