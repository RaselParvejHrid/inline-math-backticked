# Inline Math Backticked | A VS Code Extension

## How to use it?

1. Download `inline-math-backticked.vsix`, from the latest release from `Releases` section on GitHub.
1. Open the `Extensions` Panel in `VS Code`.
1. Click on the three-dot `(...)` icon.
1. Select `Install from VSIX...` menu.
1. Browse and select the downloaded `.vsix` file.
1. Enjoy.

## Context
On GitHub, Inline MathJax (like `$x^2$`) does not render, when it's a part of an Hyperlink TOC Entry. But I noticed ``$`x^2`$`` works fine.

But, I do not want backticks on my PDF.

So, I wrote this extension, to quickly move between these versions.

## Features
It adds two context menus over an .md file.

1. Backtick all ``$x^2$`` to ``$`x^2`$``, before pushing to GitHub
1. Unbacktick all ``$`x^2`$`` to `$x^2$`, for PDF

## Packaging
Packaged with `vsce package --allow-missing-repository` command.

To install `vsce`: `npm install -g @vscode/vsce`.