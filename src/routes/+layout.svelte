<script lang="ts">
	import { Computer, Github, Home, Moon, NotebookText, Sun } from 'lucide-svelte';
	import '../app.css';
	import { base } from "$app/paths"
</script>

<main class="flex min-h-screen flex-col items-center p-12 mb-16">
	<div class="font-main mt-2 mb-2 text-center flex flex-col items-center">
		<h1 class="text-7xl my-2 mb-8 tracking-tight">
			Card <span class="text-purple-700">Queries</span>
		</h1>
		<div class="mb-8 flex">
			<a href="{base}/" class="inline">
				<Home />
			</a>
			<button
				on:click={() => {
					localStorage.setItem('theme', 'dark');
					document.documentElement.classList.add('dark');
				}}
			>
				<Sun class="inline dark:hidden mx-2" />
			</button>
			<button
				on:click={() => {
					localStorage.setItem('theme', 'light');
					document.documentElement.classList.remove('dark');
				}}
			>
				<Moon class="hidden dark:inline mx-2" />
			</button>
			<a href="{base}/docs" id="docs" class="inline">
				<NotebookText />
			</a>
			<a href="{base}/dev" id="dev" class="inline ml-2">
				<Computer />
			</a>
			<a target="_blank" rel="noreferrer noopener" href="https://github.com/Kractero/kee" id="dev" class="inline ml-2">
				<Github />
			</a>
		</div>
	</div>
	<slot />
</main>
