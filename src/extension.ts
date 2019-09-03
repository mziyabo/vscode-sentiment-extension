import * as vscode from 'vscode';

let Sentiment = require("sentiment");
let AWS = require("aws-sdk");

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.analyze', () => {

        vscode.window.showInformationMessage("vscode-sentiment loaded");
        //TODO: get text and analyze
        AnalyzeWithSentiment();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
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

function AnalyzeWithSentiment() {

    let sentiment = new Sentiment({});
    let options = {
        language: "en",
        extras: null
    };

    let score = 0;
    if (vscode.window.activeTextEditor != null) {
        let text = vscode.window.activeTextEditor.document.getText();
        let sentences = text.split("\n");

        sentences.forEach(sentence => {
            // TODO: analyze each sentence here
            let result = sentiment.analyze(sentence);

            score += result.score;    // Score: -2, Comparative: -0.666
        });

        vscode.window.setStatusBarMessage(`Sentiment: ${score}`);
    }
}