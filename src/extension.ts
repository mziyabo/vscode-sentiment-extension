import * as vscode from 'vscode';

let Sentiment = require("sentiment");
let AWS = require("aws-sdk");

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.analyze', () => {

        console.log("vscode-sentiment loaded");
        //TODO: clear previous decorations
        //Get text and analyze
        AnalyzeWithSentiment();
    });

    let activeEditor = vscode.window.activeTextEditor;
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            AnalyzeWithSentiment();
        }
    }, null, context.subscriptions);

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function AnalyzeWithSentiment() {

    // Perform Sentiment Analysis
    let sentiment = new Sentiment({});
    let options = {
        language: "en",
        extras: null
    };

    let line = 0;
    let score = 0;
    if (vscode.window.activeTextEditor != null) {
        let text = vscode.window.activeTextEditor.document.getText();
        let sentences = text.split("\n");

        sentences.forEach(sentence => {
            // TODO: analyze each sentence here
            let result = sentiment.analyze(sentence);
            score += result.score;    // Score: -2, Comparative: -0.666

            var selection = vscode.window.activeTextEditor.document.lineAt(line).range;
            Decorate(score, selection);

            line += 1;
        });

        vscode.window.setStatusBarMessage(`Sentiment: ${score}`);
    }
}

function Decorate(score, selection) {

    // TODO: Create sentiment/s
    const negativeSentimentDecorator = vscode.window.createTextEditorDecorationType({

        backgroundColor: { id: 'codesentiment.NegativeSentiment' }

    });

    const positiveSentimentDecorator = vscode.window.createTextEditorDecorationType({
        backgroundColor: { id: 'codesentiment.PositiveSentiment' }
    });

    let selections = [selection];
    if (score < 0) {
        // Negative sentence
        // Extremely negative
        //if (score < -3) {
        // Decorate
        vscode.window.activeTextEditor.setDecorations(negativeSentimentDecorator, selections);
        //}

    }
    else if (score > 1) {
        // Positive sentence
        // Very Positive
        // if (score > 3) {
        vscode.window.activeTextEditor.setDecorations(positiveSentimentDecorator, selections);
        // }
    }
}

function AnalyzeWithComprehend() {

    AWS.config.region = "eu-west-1";

    let comprehend = new AWS.Comprehend();
    let params = {
        LanguageCode: "en",  /*| es | fr | de | it | pt, required */
        TextList: [ /* required */
            'you can\'t tell me anything because you don\'t know a lot',
            /* more items */
        ]
    };
    comprehend.batchDetectSentiment(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}