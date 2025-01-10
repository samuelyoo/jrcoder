import * as vscode from 'vscode';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // 1. Register the 'generateCode' command
  const generateCodeCmd = vscode.commands.registerCommand(
    'jrcoder.generateCode',
    async () => {
      try {
        // Get the user’s OpenAI API key
        const apiKey = vscode.workspace
          .getConfiguration()
          .get<string>('jrcoder.apiKey');

        if (!apiKey) {
          vscode.window.showErrorMessage('Please set your OpenAI API key in settings.');
          return;
        }

        // Ask for a prompt
        const userPrompt = await vscode.window.showInputBox({
          prompt: 'Enter a brief description of the code you want to generate',
          placeHolder: 'e.g. "Generate a React component with state handling"'
        });

        if (!userPrompt) {
          return;
        }

        // Initialize OpenAI
        const openai = new OpenAI({
			apiKey: 'YOUR_KEY'
		});

        // Create a chat completion request to GPT-4
		const response = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
			  { role: 'system', content: 'You are a helpful assistant.' },
			  { role: 'user', content: 'Hello!' },
			],
          max_tokens: 800,
        });

        const reply = response.choices[0].message?.content || '';
		console.log('GPT-4 reply:', reply);
        // Show code in a new document
        const doc = await vscode.workspace.openTextDocument({
          content: reply,
          language: 'typescript' // or 'javascript', etc.
        });
        await vscode.window.showTextDocument(doc);

      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${error?.message}`);
      }
    }
  );

  // 2. Register the 'analyzeRepo' command
  const analyzeRepoCmd = vscode.commands.registerCommand(
    'jrcoder.analyzeRepo',
    async () => {
      try {
        const apiKey = vscode.workspace
          .getConfiguration()
          .get<string>('jrcoder.apiKey');

        if (!apiKey) {
          vscode.window.showErrorMessage('Please set your OpenAI API key in settings.');
          return;
        }

        // Get current workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage('No workspace folder found.');
          return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        // Example: Scan for .js, .ts, .py, .jsx, .tsx, etc.
        const files = await vscode.workspace.findFiles(
          '**/*.{js,ts,py,jsx,tsx,java,cs,cpp,go,rb}',
          '**/node_modules/**'
        );

        // Read and aggregate file content
        let aggregatedContent = '';
        const maxChunkSize = 3000;  // Simple character-based chunk limit

        for (const file of files) {
          const absPath = file.fsPath;
          const content = fs.readFileSync(absPath, 'utf-8');

          if (content.length > maxChunkSize) {
            // Chunk if needed (sample approach)
            const chunkCount = Math.ceil(content.length / maxChunkSize);
            for (let i = 0; i < chunkCount; i++) {
              const start = i * maxChunkSize;
              const end = Math.min(start + maxChunkSize, content.length);
              const chunk = content.substring(start, end);
              aggregatedContent += `\nFile: ${path.basename(absPath)}\n${chunk}\n`;
            }
          } else {
            aggregatedContent += `\nFile: ${path.basename(absPath)}\n${content}\n`;
          }
        }

        // Summarize with GPT-4
        const openai = new OpenAI({
			apiKey: 'YOUR_KEY'
		});

        // Because GPT-4 has a token limit, consider doing multi-pass summarization
        // For simplicity, do a single pass in this example
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a codebase analyzer.' },
            {
              role: 'user',
              content: `Analyze and summarize this codebase:\n${aggregatedContent}`
            }
          ],
          max_tokens: 1000
        });

        const analysis = response.choices[0].message?.content || '';
        
        // Display in output channel
        const outputChannel = vscode.window.createOutputChannel('JRCoder Analysis');
        outputChannel.appendLine(analysis);
        outputChannel.show(true);

        vscode.window.showInformationMessage('Analysis complete. Check the "JRCoder Analysis" output channel.');

      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${error?.message}`);
      }
    }
  );

  // Push commands to the extension context
  context.subscriptions.push(generateCodeCmd, analyzeRepoCmd);
}

export function deactivate() {
  // Cleanup if needed
}
