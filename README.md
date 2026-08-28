# PlooTools 🛠️

[![Version](https://img.shields.io/visual-studio-marketplace/v/UismaLopes.plootools?label=marketplace)](https://marketplace.visualstudio.com/items?itemName=UismaLopes.plootools)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/UismaLopes.plootools)](https://marketplace.visualstudio.com/items?itemName=UismaLopes.plootools)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

A VS Code extension to scaffold React components, state managers and test files following
Ploomes' code conventions — intuitively, from the Explorer's right-click menu.

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Commands](#commands)
  - [Create React Component](#create-react-component)
  - [Create State Manager (Recoil)](#create-state-manager-recoil)
  - [Create State Manager (Jotai)](#create-state-manager-jotai)
  - [Create Tests](#create-tests)
  - [Create function and test files](#create-function-and-test-files)
  - [Insert new icons](#insert-new-icons)
- [Choosing which files to create](#choosing-which-files-to-create)
- [Customizing the generated templates](#customizing-the-generated-templates)
- [Snippets](#snippets)
- [License](#license)

## Features

- Scaffolds a full React component structure (`controller`, `view`, `style`, `props`, `index`)
  following Ploomes' pattern, in a new folder or straight into an existing one.
- Scaffolds Recoil or Jotai state managers with the same folder/files flow.
- Lets you **pick exactly which files to generate** for every structure above — nothing you
  don't ask for gets created, and files you skip are never referenced by the ones you keep.
- Creates Jest test files for one file or for every file in a folder, skipping tests that
  already exist.
- Creates a function + its matching test file (TypeScript or JavaScript) in one step.
- Inserts new FontAwesome icon imports across a folder's files.
- Lets you fully customize the generated templates per project (see
  [Customizing the generated templates](#customizing-the-generated-templates)).
- Ships snippets for controllers, views, styles, interfaces, index files and tests.

## Requirements

- VS Code `^1.72.0`.
- No other dependencies — everything needed ships with the extension.

## Getting started

1. Install **PlooTools** from the VS Code Marketplace.
2. Right-click any folder in the Explorer and choose **PlooTools** to open the command menu, or
   **PlooTools init** to set up custom templates for the current workspace (optional, see
   [Customizing the generated templates](#customizing-the-generated-templates)).

## Commands

### Create React Component

Choose between creating a new folder + files, or adding the files straight into the folder you
right-clicked (files only) — you'll then pick which files to generate (see
[Choosing which files to create](#choosing-which-files-to-create)).

#### ▶️ Create folder and files

![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/example_1.gif)

#### ▶️ Create files only

![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/example_2.gif)

### Create State Manager (Recoil)

Same folder/files flow as the React component, generating an `atom`, `dispatch`, `getState`,
`state` and `index`.

#### ▶️ Create folder and files

![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/example_6.gif)

### Create State Manager (Jotai) 🆕

Same flow, with optional support for `atomFamily` and resettable atoms (`atomWithReset` /
`useResetAtom`), selectable when you run the command.

#### ▶️ Create folder and files

![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/example_7.gif)

### Create Tests

Generates a Jest test file for every file in the selected folder. Files that already have a
test, `index` files, and existing `.test`/`.spec` files are skipped automatically.

![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/example_3.gif)

### Create function and test files

Creates a function file (TypeScript or JavaScript) with the name you provide, plus its matching
test file — and an `index.ts` re-export when one doesn't exist yet.

![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/example_4.gif)

### Insert new icons

Given an icon name, scans every file in the selected folder, adds the missing FontAwesome import
from whichever `@fortawesome/*` package is already used in that file, and appends the icon to the
nearest exported array — skipping files where the icon doesn't actually exist in that package.

## Choosing which files to create

Every "Create folder and files" / "Create files only" flow above shows a multi-select list of the
files it's about to generate, all pre-selected — uncheck anything you don't need for that
component or state manager.

Deselected files are not just skipped: the files you do keep are generated without importing or
exporting anything that wasn't created. For example, picking only `index`, `controller` and
`view` for a React component gives you an `index.ts` that doesn't import `props`, and a
`controller` that doesn't import or type against it either.

> The one exception is a file's genuine functional dependency — e.g. a Recoil/Jotai `dispatch`,
> `state` or `getState` file always needs its `atom`, and a `controller` always needs its `view`.
> Deselecting those while keeping their dependents will still produce a dangling import, since
> there's no meaningful way to generate that file without it.

## Customizing the generated templates

Running **PlooTools init** from the Explorer's right-click menu creates a `.plootools` folder in
your workspace with an editable, plain-JavaScript copy of every template (`react.js`, `jest.js`,
`func.js`, `recoil.js`, `jotai.js`). Edit any of them to change what gets generated project-wide —
PlooTools watches these files and picks up your changes automatically, no reload needed.

![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/example_5.gif)

## Snippets

- Create controller
  - ![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/snippet_1.gif)
- Create interface
  - ![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/snippet_2.gif)
- Create style
  - ![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/snippet_3.gif)
- Create view
  - ![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/snippet_4.gif)
- Create index (to use this snippet, write the file name, copy it, delete it, then start typing
  `plootools`)
  - ![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/snippet_5.gif)
- Create test
  - ![](https://raw.githubusercontent.com/Ploomes/plootools/main/img/snippet_6.gif)

## License

MIT © [Uisma Lopes](https://github.com/UismaLopes)
