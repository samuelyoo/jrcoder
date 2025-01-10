# JRCoder

**JRCoder** is a Visual Studio Code extension that leverages OpenAI’s GPT-4 to:
1. **Generate Code**: Prompt the AI to create boilerplate, snippets, or specialized code in a new editor tab.  
2. **Analyze Repositories**: Scan and summarize multiple files in a folder or workspace, providing insights into structure, features, or potential refactoring.

## Table of Contents
1. [Features](#features)  
2. [Requirements](#requirements)  
3. [Installation](#installation)  
4. [Setup](#setup)  
5. [Usage](#usage)  
6. [Workflow Diagram](#workflow-diagram)  
7. [License](#license)

---

## Features

- **AI-Powered Code Generation**  
  Prompt GPT-4 for code snippets or entire functions. The generated code opens in a new editor tab for easy editing.

- **Workspace Analysis**  
  Collects code from your project (e.g., `.js`, `.ts`, `.py`, etc.), chunks if necessary, and provides an overall summary or suggestions.

- **Configurable API Key**  
  Store your OpenAI API key via the VSCode Settings panel, avoiding the need to hardcode secrets.

- **Output Channel**  
  Analysis output is displayed in a dedicated “JRCoder Analysis” channel, keeping your main editor uncluttered.

---

## Requirements

- **Visual Studio Code** (version 1.80.0 or later recommended).  
- **Node.js** (version 16+).  
- **OpenAI API Key** (with access to GPT-4 if you want GPT-4 features).

---

## Installation

1. **Clone or Download** this repository locally:
   ```bash
   git clone https://github.com/yourusername/jrcoder.git
   cd jrcoder
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Extension**:
   ```bash
   npm run build
   ```
   - This runs TypeScript compilation and bundles the code via **esbuild** into the `dist/` folder.

4. **Launch Extension** (in VSCode):
   - Open this folder in VSCode.
   - Press `F5` to start a new **Extension Development Host** instance.

---

## Setup

1. **Configure API Key**  
   - In VSCode, open **Settings** (Ctrl + , / Cmd + ,).  
   - Search for `jrcoder.apiKey`.  
   - Enter your OpenAI API key.  
   - Example: `sk-abc123XYZ...`

2. **(Optional) Adjust File Matching Patterns**  
   - By default, the extension analyzes common file extensions (`*.ts`, `*.js`, `*.py`, etc.).  
   - You can modify the file patterns in `extension.ts` to include or exclude specific extensions or directories.

---

## Usage

### 1. Generate Code

1. Press `Ctrl + Shift + P` (Cmd + Shift + P on Mac) to open the **Command Palette**.  
2. Type **"JRCoder: Generate Code"** and press **Enter**.  
3. Enter a brief prompt describing what you want (e.g., “React component with state management”).  
4. JRCoder will create a new tab with GPT-generated code.

### 2. Analyze Repository

1. Open a folder or workspace in VSCode.  
2. Press `Ctrl + Shift + P` (Cmd + Shift + P on Mac).  
3. Type **"JRCoder: Analyze Repository"** and press **Enter**.  
4. JRCoder scans all relevant files, chunks them if they’re large, and sends them to GPT-4 for summarization.  
5. Check the **"JRCoder Analysis"** output channel to see the summary or insights.

---

## Workflow Diagram

Below is a **Mermaid** diagram illustrating how a user command flows through the extension to OpenAI and back:

```mermaid
flowchart LR
    A[User] -->|Invoke Command<br/>(Generate/Analyze)| B(Command Palette)
    B --> C[JRCoder Extension]
    C -->|Reads Settings for <br/> API Key| D[OpenAI GPT-4 API]
    D --> C
    C -->|Results| E[VSCode<br/>Output Channel]
    C -->|Or Generated Code| F[New Editor Tab]
```

### Explanation
1. The **User** triggers either “Generate Code” or “Analyze Repository” via the **Command Palette**.  
2. The **JRCoder Extension** fetches the **OpenAI API key** from VSCode Settings.  
3. The extension then sends the request (prompt or aggregated code) to **OpenAI’s GPT-4 API**.  
4. The API response returns to the extension.  
5. The extension displays results in the **Output Channel** or a **New Editor Tab**, depending on the command.

---

## License

[MIT License](LICENSE)

You are free to use and modify JRCoder for your own projects. See the `LICENSE` file for more details.

**Happy Coding!**

Feel free to open an issue or PR if you have any questions or suggestions.

