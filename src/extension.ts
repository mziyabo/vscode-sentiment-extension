import * as vscode from 'vscode';

let Sentiment = require("sentiment");
let timeout: NodeJS.Timer | undefined = undefined;
let collection;

export function activate(context: vscode.ExtensionContext) {
    let activeEditor = vscode.window.activeTextEditor;

    let disposable = vscode.commands.registerCommand('extension.analyze', () => {
        collection = vscode.languages.createDiagnosticCollection("Negative Sentiments");

        if (activeEditor) {
            console.log("vscode-sentiment loaded");

            //Get activeTextEditor and analyze text
            TriggerAnalyzeSentiment(collection);
        }
    });

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            TriggerAnalyzeSentiment(collection);
        }
    }, null, context.subscriptions);

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            TriggerAnalyzeSentiment(collection);
        }
    }, null, context.subscriptions);

    function AnalyzeSentiment(collection) {

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

            result.negative.forEach(negative => {
                let match;
                const pattern = new RegExp(negative, "g");
                while (match = pattern.exec(text)) {

                    const startPos = activeEditor.document.positionAt(match.index);
                    const endPos = activeEditor.document.positionAt(match.index + match[0].length);

                    let selection = new vscode.Range(startPos, endPos);
                    let diagnostic = new vscode.Diagnostic(selection, `Found negative sentiment: '${negative}'`, vscode.DiagnosticSeverity.Error);

                    //TODO: Don't push diagnostic message if already pushed
                    diagnostics.push(diagnostic);

                }
            });

            // Push sentiment diagnostic message
            collection.set(vscode.window.activeTextEditor.document.uri, diagnostics);
        };

    }

    function TriggerAnalyzeSentiment(collection) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }

        collection.set(vscode.window.activeTextEditor.document.uri, undefined);
        timeout = setTimeout(AnalyzeSentiment, 500, collection);
    }

    context.subscriptions.push(disposable);
}

function Decorate(score, selection) {

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

// this method is called when your extension is deactivated
export function deactivate() {
}

exports.activate = activate;