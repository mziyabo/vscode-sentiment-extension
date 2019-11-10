import * as vscode from 'vscode';
let Sentiment = require("sentiment");
let timeout: NodeJS.Timer | undefined = undefined;

export function AnalyzeSentiment(collection) {

    let activeEditor = vscode.window.activeTextEditor;

    let sentiment = new Sentiment({});
    let options = {
        language: "en",
        extras: null
    };

    if (vscode.window.activeTextEditor != null) {
        let text = vscode.window.activeTextEditor.document.getText();

        let result = sentiment.analyze(text);
        vscode.window.setStatusBarMessage(`Sentiment: ${result.score}`);

        let diagnostics = [];
        let matched = [];
        result.negative.forEach(negative => {
            let match;
            const pattern = new RegExp(negative, "g");

            if (!matched.includes(negative)) {
                while (match = pattern.exec(text)) {

                    const startPos = activeEditor.document.positionAt(match.index);
                    const endPos = activeEditor.document.positionAt(match.index + match[0].length);

                    let selection = new vscode.Range(startPos, endPos);
                    let diagnostic = new vscode.Diagnostic(selection, `Found negative sentiment: '${negative}'`, vscode.DiagnosticSeverity.Warning);

                    diagnostics.push(diagnostic);
                }
            }

            matched.push(negative);
        });

        collection.set(vscode.window.activeTextEditor.document.uri, diagnostics);
    };

}