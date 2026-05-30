import { EditorView, basicSetup } from "codemirror"

new EditorView({
  doc: "# Hello, Lemma\n\nType some $\\LaTeX$ here...",  // initial editor contents
  parent: document.querySelector("#editor")!,            // DOM element to mount into
  extensions: [basicSetup],                              // the editor *is* this list of extensions
});
