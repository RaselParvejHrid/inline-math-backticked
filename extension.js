const vscode = require('vscode');

/**
 * Helper to process transformations safely on selected text or full document.
 * Checks preceding text for <!-- markdown-math-utilities-ignore --> comment.
 */
async function processMathTransform(editor, regex, replacementCallback) {
    const document = editor.document;
    const selection = editor.selection;

    // Scope: Selection (if not empty) or full document
    const isSelection = !selection.isEmpty;
    const targetRange = isSelection
        ? new vscode.Range(selection.start, selection.end)
        : new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));

    const textToSearch = document.getText(targetRange);
    const baseOffset = isSelection ? document.offsetAt(selection.start) : 0;

    await editor.edit(editBuilder => {
        let match;
        // Reset regex index state
        regex.lastIndex = 0;

        while ((match = regex.exec(textToSearch)) !== null) {
            const matchStartOffset = baseOffset + match.index;
            const matchEndOffset = matchStartOffset + match[0].length;

            // Check text immediately preceding the match for <!-- markdown-math-utilities-ignore -->
            const textBeforeMatch = document.getText(
                new vscode.Range(document.positionAt(0), document.positionAt(matchStartOffset))
            );

            // Matches <!-- markdown-math-utilities-ignore --> with optional trailing spaces
            const ignorePattern = /<!--\s*markdown-math-utilities-ignore\s*-->\s*$/i;

            if (ignorePattern.test(textBeforeMatch)) {
                continue; // Skip transformation if comment precedes match
            }

            const matchRange = new vscode.Range(
                document.positionAt(matchStartOffset),
                document.positionAt(matchEndOffset)
            );

            const replacementText = replacementCallback(match, document);
            editBuilder.replace(matchRange, replacementText);
        }
    });
}

function activate(context) {
    const eol = (doc) => (doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n');

    // Command 1: $x^2$ -> $`x^2`$
    const backtickInlines = vscode.commands.registerCommand(
        'MarkdownMath.backtickInlines',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const regex = /(?<!\$)\$([^$`\r\n]+)\$(?!\$)/g;
            await processMathTransform(editor, regex, (match) => `$\`${match[1]}\`$`);
        }
    );

    // Command 2: $`x^2`$ -> $x^2$
    const unbacktickInlines = vscode.commands.registerCommand(
        'MarkdownMath.unbacktickInlines',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const regex = /\$`([^`\r\n]+)`\$/g;
            await processMathTransform(editor, regex, (match) => `$${match[1]}$`);
        }
    );

    // Command 3: $$ block -> ```math codeblock
    const doubleDollarToMathFence = vscode.commands.registerCommand(
        'MarkdownMath.doubleDollarToMathFence',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            // Matches multiline or singleline $$...$$ blocks
            const regex = /\$\$\r?\n?([\s\S]*?)\r?\n?\$\$/g;
            await processMathTransform(
                editor,
                regex,
                (match, doc) => `\`\`\`math${eol(doc)}${match[1].trim()}${eol(doc)}\`\`\``
            );
        }
    );

    // Command 4: ```math codeblock -> $$ block
    const mathFenceToDoubleDollar = vscode.commands.registerCommand(
        'MarkdownMath.MathFenceToDoubleDollar',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            // Matches ```math ... ``` blocks
            const regex = /```math\r?\n([\s\S]*?)\r?\n```/g;
            await processMathTransform(
                editor,
                regex,
                (match, doc) => `$$${eol(doc)}${match[1].trim()}${eol(doc)}$$`
            );
        }
    );

    // Command 5: Prepend <!-- markdown-math-utilities-ignore --> before cursor / selection
    const addTheIgnoreComment = vscode.commands.registerCommand(
        'MarkdownMath.addTheIgnoreComment',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const commentText = '<!-- markdown-math-utilities-ignore -->';

            await editor.edit(editBuilder => {
                for (const selection of editor.selections) {
                    // Inserts at selection start (or current cursor if nothing is selected)
                    editBuilder.insert(selection.start, commentText);
                }
            });
        }
    );

    context.subscriptions.push(
        backtickInlines,
        unbacktickInlines,
        doubleDollarToMathFence,
        mathFenceToDoubleDollar,
        addTheIgnoreComment
    );
}

function deactivate() { }

module.exports = { activate, deactivate };