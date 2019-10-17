import * as vscode from 'vscode';
let Sentiment = require("sentiment");
let timeout: NodeJS.Timer | undefined = undefined;

export function AnalyzeSentiment(collection) {

    let activeEditor = vscode.window.activeTextEditor;

    // Perform Sentiment Analysis
    let sentiment = new Sentiment({});
    let options = {
        language: "en",
        extras: null
    };

    if (vscode.window.activeTextEditor != null) {
        let text = vscode.window.activeTextEditor.document.getText();

        // TODO: analyze each sentence here
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
                    let diagnostic = new vscode.Diagnostic(selection, `Found negative sentiment: '${negative}'`, vscode.DiagnosticSeverity.Error);

                    //TODO: Don't push diagnostic message if already pushed
                    diagnostics.push(diagnostic);

                }
            }

            matched.push(negative);
        });

        // Push sentiment diagnostic message
        collection.set(vscode.window.activeTextEditor.document.uri, diagnostics);
    };

}

//#region Deprecated
export function TriggerAnalyzeSentiment(collection) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    }

    collection.set(vscode.window.activeTextEditor.document.uri, undefined);
    timeout = setTimeout(AnalyzeSentiment, 500, collection);
}


export function Decorate(score, selection) {

    //TODO: Clear previous decorations
    const negativeSentimentDecorator = vscode.window.createTextEditorDecorationType({
        backgroundColor: { id: 'codesentiment.NegativeSentiment' }
    });

    const positiveSentimentDecorator = vscode.window.createTextEditorDecorationType({
        backgroundColor: { id: 'codesentiment.PositiveSentiment' }
    });

    let selections = [selection];
    if (score < 0) {
        // Negative sentiment
        vscode.window.activeTextEditor.setDecorations(negativeSentimentDecorator, selections);
    }
    else if (score > 1) {
        // Positive sentiment
        vscode.window.activeTextEditor.setDecorations(positiveSentimentDecorator, selections);
    }
}

//#endregion Deprecated
