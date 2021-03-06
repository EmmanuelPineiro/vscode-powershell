/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as assert from "assert";
import * as path from "path";
import * as vscode from "vscode";
import { PowerShellNotebooksFeature } from "../../src/features/PowerShellNotebooks";
import os = require("os");
import { readFileSync } from "fs";
import { CommentType } from "../../src/settings";
import * as utils from "../../src/utils";
import { MockLogger } from "../test_utils";

const notebookDir = [
    __dirname,
    "..",
    "..",
    "..",
    "test",
    "features",
    "testNotebookFiles"
];

const notebookOnlyCode = vscode.Uri.file(
    path.join(...notebookDir, "onlyCode.ps1"));
const notebookOnlyMarkdown = vscode.Uri.file(
    path.join(...notebookDir,"onlyMarkdown.ps1"));
const notebookSimpleBlockComments = vscode.Uri.file(
    path.join(...notebookDir,"simpleBlockComments.ps1"));
const notebookBlockCommentsWithTextOnSameLine = vscode.Uri.file(
    path.join(...notebookDir,"blockCommentsWithTextOnSameLine.ps1"));
const notebookSimpleLineComments = vscode.Uri.file(
    path.join(...notebookDir,"simpleLineComments.ps1"));
const notebookSimpleMixedComments = vscode.Uri.file(
    path.join(...notebookDir,"simpleMixedComments.ps1"));

const notebookTestData = new Map<vscode.Uri, vscode.NotebookCellData[]>();

function readBackingFile(uri: vscode.Uri): string {
    return readFileSync(uri.fsPath).toString();
}

function compareCells(actualCells: vscode.NotebookCellData[], expectedCells: vscode.NotebookCellData[]) : void {
    assert.deepStrictEqual(actualCells.length, expectedCells.length);

    // Compare cell metadata
    for (let i = 0; i < actualCells.length; i++) {
        assert.deepStrictEqual(
            actualCells[i].metadata.custom,
            expectedCells[i].metadata.custom
        );
    }
}

suite("PowerShellNotebooks tests", () => {
    notebookTestData.set(notebookOnlyCode, [
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: readBackingFile(notebookOnlyCode),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        }
    ]);

    notebookTestData.set(notebookOnlyMarkdown, [
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: readBackingFile(notebookOnlyMarkdown),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.LineComment,
                }
            }
        }
    ]);

    let content = readBackingFile(notebookSimpleBlockComments).split(os.EOL);
    notebookTestData.set(notebookSimpleBlockComments, [
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(0, 5).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: true,
                    openBlockCommentOnOwnLine: true
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(5, 6).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(6, 11).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: true,
                    openBlockCommentOnOwnLine: true
                }
            }
        },
    ]);

    content = readBackingFile(notebookBlockCommentsWithTextOnSameLine).split(os.EOL);
    notebookTestData.set(notebookBlockCommentsWithTextOnSameLine, [
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(0, 5).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: true,
                    openBlockCommentOnOwnLine: true
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(5, 6).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(6, 9).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: false,
                    openBlockCommentOnOwnLine: false
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(9, 10).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(10, 13).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: true,
                    openBlockCommentOnOwnLine: false
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(13, 14).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(14, 17).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: false,
                    openBlockCommentOnOwnLine: true
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(17, 18).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(18, 19).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: false,
                    openBlockCommentOnOwnLine: false
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(19, 20).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
    ]);

    content = readBackingFile(notebookSimpleLineComments).split(os.EOL);
    notebookTestData.set(notebookSimpleLineComments, [
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(0, 3).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.LineComment,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(3, 4).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(4, 7).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.LineComment,
                }
            }
        },
    ]);

    content = readBackingFile(notebookSimpleMixedComments).split(os.EOL);
    notebookTestData.set(notebookSimpleMixedComments, [
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(0, 3).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.LineComment,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Code,
            language: "powershell",
            source: content.slice(3, 4).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.Disabled,
                }
            }
        },
        {
            cellKind: vscode.CellKind.Markdown,
            language: "markdown",
            source: content.slice(4, 9).join(os.EOL),
            outputs: [],
            metadata: {
                custom: {
                    commentType: CommentType.BlockComment,
                    closeBlockCommentOnOwnLine: true,
                    openBlockCommentOnOwnLine: true
                }
            }
        },
    ]);

    const feature = new PowerShellNotebooksFeature(new MockLogger(), true);
    // `notebookContentProvider` is a private property so cast the feature as `any` so we can access it.
    const notebookContentProvider: vscode.NotebookContentProvider = (feature as any).notebookContentProvider;

    for (const [uri, expectedCells] of notebookTestData) {
        test(`Can open a notebook with expected cells - ${uri.fsPath}`, async () => {
            const actualNotebookData = await notebookContentProvider.openNotebook(uri, {});
            compareCells(actualNotebookData.cells, expectedCells);
        });
    }

    test("Can save a new notebook with expected cells and metadata", async () => {
        const uri = vscode.Uri.file(path.join(__dirname, "testFile.ps1"));
        try {
            await vscode.workspace.fs.delete(uri);
        } catch {
            // If the file doesn't exist that's fine.
        }

        // Open an existing notebook ps1.
        await vscode.commands.executeCommand("vscode.openWith", notebookSimpleMixedComments, "PowerShellNotebookMode");

        // Allow some time to pass to render the Notebook
        await utils.sleep(5000);
        assert.strictEqual(
            vscode.notebook.activeNotebookEditor.document.uri.toString(),
            notebookSimpleMixedComments.toString());

        // Save it as testFile.ps1 and reopen it using the feature.
        await notebookContentProvider.saveNotebookAs(uri, vscode.notebook.activeNotebookEditor.document, null);
        const newNotebook = await notebookContentProvider.openNotebook(uri, {});

        // Compare that saving as a file results in the same cell data as the existing one.
        const expectedCells = notebookTestData.get(notebookSimpleMixedComments);
        compareCells(newNotebook.cells, expectedCells);
    }).timeout(20000);

    test("Can save a new notebook with expected content", async () => {
        const uri = vscode.Uri.file(path.join(__dirname, "testFile1.ps1"));
        try {
            await vscode.workspace.fs.delete(uri);
        } catch {
            // If the file doesn't exist that's fine.
        }

        // Open an existing notebook ps1.
        await vscode.commands.executeCommand("vscode.openWith", notebookBlockCommentsWithTextOnSameLine, "PowerShellNotebookMode");

        // Allow some time to pass to render the Notebook
        await utils.sleep(5000);
        assert.strictEqual(
            vscode.notebook.activeNotebookEditor.document.uri.toString(),
            notebookBlockCommentsWithTextOnSameLine.toString());

        // Save it as testFile1.ps1
        const contentOfBackingFileBefore = (await vscode.workspace.fs.readFile(notebookBlockCommentsWithTextOnSameLine)).toString();
        await notebookContentProvider.saveNotebookAs(uri, vscode.notebook.activeNotebookEditor.document, null);
        const contentOfBackingFileAfter = (await vscode.workspace.fs.readFile(uri)).toString();

        // Verify that saving does not mutate result.
        assert.strictEqual(contentOfBackingFileBefore, contentOfBackingFileAfter);
    }).timeout(20000);
});
