import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "katex/dist/katex.min.css";

import { open, save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener"
import { getCurrentWindow } from "@tauri-apps/api/window"

import { Prec } from "@codemirror/state"
import { keymap } from "@codemirror/view";
import { EditorView, basicSetup } from "codemirror";

import MarkdownIt from "markdown-it";
import mk from "@vscode/markdown-it-katex";
import katex from "katex";

let currentPath: string | null = null;

const md = new MarkdownIt().use(mk, { katex });

const editorEl = document.querySelector<HTMLDivElement>("#editor");
const previewEl = document.querySelector<HTMLDivElement>("#preview");

if (!editorEl || !previewEl) {
  throw new Error("Required DOM elements #editor and #preview were not found.");
}

function updatePreview(text: string) {
  previewEl!.innerHTML = md.render(text);
}

async function handleOpen(view: EditorView) {
  try {
    const selected = await open({
      multiple: false,
      filters: [{ name: "Markdown", extensions: ["md", "markdown", "txt"] }],
    });

    if (typeof selected !== "string") return;

    const content = await invoke<string>("read_file", { path: selected });
    currentPath = selected;

    // Swap the editor content
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: content },
    });
  } catch (error) {
    console.error("Failed to open file:", error);
    alert("Could not open the file.");
  }
}

async function handleSave(view: EditorView) {
  try {
    let path = currentPath;

    // If it's a new file, ask the user where to save it
    if (!path) {
      const chosen = await save({
        filters: [{ name: "Markdown", extensions: ["md"] }],
      });
      if (typeof chosen !== "string") return;
      path = chosen;
    }

    await invoke("write_file", { path, contents: view.state.doc.toString() });
    currentPath = path; // Update the path in case it was newly created
  } catch (error) {
    console.error("Failed to save file:", error);
    alert("Could not save the file.");
  }
}

previewEl.addEventListener("click", (e) => {
  const link = (e.target as HTMLElement).closest("a")
  if (link?.href) {
    e.preventDefault()
    openUrl(link.href).then(/* leaving empty for now to avoid warning */)
  }
})

const view = new EditorView({
  doc: "Hello world!",
  parent: editorEl,
  extensions: [
    Prec.highest(keymap.of([{ key: "Mod-f", run: () => true }])),
    basicSetup,
    EditorView.lineWrapping,
    keymap.of([
      {key: "Mod-o", run: () => { handleOpen(view); return true; }},
      {key: "Mod-s", run: () => { handleSave(view); return true; }}
    ]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) updatePreview(update.state.doc.toString());
    }),
  ],
});

updatePreview(view.state.doc.toString());
getCurrentWindow().show()