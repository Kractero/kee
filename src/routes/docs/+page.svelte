<script lang="ts">
	import Head from '$lib/components/Head.svelte'

	// @ts-expect-error importing docs markdown
	import Docs from './Docs.md'
</script>

<Head title={`Queries - Docs}`} description={'Query cards from the NationStates card game'} />

<article class="prose dark:prose-invert">
	<Docs />
</article>
