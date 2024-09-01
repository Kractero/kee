<script lang="ts">
	import Head from '$lib/components/Head.svelte'
	import SvelteMarkdown from 'svelte-markdown'

	import Docs from './Docs.md?raw'
</script>

<Head title={`Queries - Docs}`} description={'Query cards from the NationStates card game'} />

<article class="prose dark:prose-invert">
	<SvelteMarkdown source={Docs} />
</article>
