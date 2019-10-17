import * as vscode from 'vscode';
import { TriggerAnalyzeSentiment, AnalyzeSentiment } from "./sentiment"

let collection;

export function activate(context: vscode.ExtensionContext) {

    let activeEditor = vscode.window.activeTextEditor;

    let disposable = vscode.commands.registerCommand('extension.analyze', () => {
        collection = vscode.languages.createDiagnosticCollection("Negative Sentiments");

        if (activeEditor) {
            console.log("vscode-sentiment loaded");

            // Get activeTextEditor and analyze text
            TriggerAnalyzeSentiment(collection);
        }
    });

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            AnalyzeSentiment(collection);
        }
    }, null, context.subscriptions);

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            AnalyzeSentiment(collection);
        }
    }, null, context.subscriptions);

    context.subscriptions.push(disposable);
}

export function deactivate() {
}