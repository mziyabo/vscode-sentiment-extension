import * as vscode from 'vscode';
import { AnalyzeSentiment } from "./sentiment"

let collection = vscode.languages.createDiagnosticCollection("Negative Sentiments");;

export function activate(context: vscode.ExtensionContext) {

    let activeEditor = vscode.window.activeTextEditor;

    let disposable = vscode.commands.registerCommand('extension.analyze', () => {
        if (activeEditor) {
            AnalyzeSentiment(collection);
        }
    });

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document == activeEditor.document) {
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
    collection.delete(vscode.window.activeTextEditor.document.uri);
}