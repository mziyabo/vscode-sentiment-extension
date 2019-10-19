# vscode sentiment extension

Visual Studio Code extension project to perform sentiment analysis on text. Uses the [npm sentiment library](https://www.npmjs.com/package/sentiment) to analyze sentiment based on the [AFINN](http://www2.imm.dtu.dk/pubdb/views/edoc_download.php/6006/pdf/imm6006.pdf) word list.


### Features:

- Negative words in the AFINN list are underlined with a red squiggly and noted in the `Problems` tab. Overall sentiment of the document is displayed in the status bar:

![Overview](./resources/marketplace/vscode-sentiment-feature.PNG)

- Sentiment analysis is automatic for `plaintext` and `markdown`. 
- Use `Sentiment: perform sentiment analysis` command from the Command Palette to analyze manually.

### Release Notes:

This extension is still a work in progress.