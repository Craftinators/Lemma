<script lang="ts">
    import Editor from "$lib/components/Editor.svelte";

    let source = `\\documentclass{article}\n\\begin{document}\nHello, world!\n\\end{document}`;
</script>

<div class="page">
    <Editor bind:value={source} />
</div>

<style>
    .page {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
</style>