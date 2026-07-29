const vscode = require('vscode');

function activate(context) {
    // Option 1: Convert $x^2$ to $`x^2`$, keeping $$ math untouched
    let convertToBacktick = vscode.commands.registerCommand('InlineMath.backtick', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const text = document.getText();
        // Negative lookbehind (?<!\$) and negative lookahead (?!\$) strictly ignore double-dollar $$
        const regex = /(?<!\$)\$([^$`\r\n]+)\$(?!\$)/g;

        await editor.edit(editBuilder => {
            let match;
            while ((match = regex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                editBuilder.replace(range, `$\`${match[1]}\`$`);
            }
        });
    });

    // Option 2: Convert $`x^2`$to$$
    let convertToBlock = vscode.commands.registerCommand('InlineMath.unbacktick', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const text = document.getText();
        const regex = /\$`([^`\r\n]+)`\$/g;

        await editor.edit(editBuilder => {
            let match;
            while ((match = regex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);

                editBuilder.replace(range, `$${match[1]}$`);
            }
        });
    });

    context.subscriptions.push(convertToBacktick, convertToBlock);
}

function deactivate() { }

module.exports = { activate, deactivate };