# Markdown Math Utilities 2.0.0 | A VS Code Extension

## How to use it?

1. Download `markdown-math-utilities-2.0.0.vsix`, from the latest commit.
1. Open the `Extensions` Panel in `VS Code`.
1. Click on the three-dot `(...)` icon.
1. Select `Install from VSIX...` menu.
1. Browse and select the downloaded `.vsix` file.
1. Enjoy.

## Context
Inline MathJax on a markdown (`.md`) file, like `$x^2$`, does not render, on GitHub, when it's a part of an Hyperlink TOC Entry. But I noticed ``$`x^2`$`` works just fine, while GitHub even hides backticks, which is desirable.

But my `.md to .pdf converter` does not hide backticks on exported PDF Documents.

So, I wrote this extension, to quickly move between these versions.

## Features
It adds five context menus over an .md file.

1. `Backtick Inlines`: Backtick all ``$x^2$`` to ``$`x^2`$``, for me, before pushing to GitHub.
2. `Unbacktick Inlines`: Unbacktick all ``$`x^2`$`` to `$x^2$`, for me, before conversion to PDF.
3. ``$$ to ```math``
4. `` ```math to $$``
5. `Ignore`: Add a comment at the cursor position or just before the selected inline/block MathJax or Code Fence to ignore using during conversions.

## Packaging
 This extension is packaged into a `.vsix` file with this command:
 
```bash
vsce package --allow-missing-repository
```

To install `vsce`:
```bash
npm install -g @vscode/vsce
```