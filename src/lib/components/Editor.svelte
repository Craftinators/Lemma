<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
    import { EditorState } from '@codemirror/state';
    import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';
    import { oneDark } from '@codemirror/theme-one-dark';
    import { latex } from 'codemirror-lang-latex';

    export let value = '';

    let container: HTMLDivElement;
    let view: EditorView;

    onMount(() => {
        const state = EditorState.create({
            doc: value,
            extensions: [
                history(),
                lineNumbers(),
                highlightActiveLine(),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                oneDark,
                latex(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        value = update.state.doc.toString();
                    }
                }),
            ],
        });

        view = new EditorView({ state, parent: container });
    });

    onDestroy(() => view?.destroy());
</script>

<div bind:this={container} class="editor"></div>

<style>
    .editor {
        height: 100%;
    }

    .editor :global(.cm-editor) {
        height: 100%;
    }

    .editor :global(.cm-scroller) {
        font-family: monospace;
        font-size: 14px;
        overflow: auto;
    }
</style>