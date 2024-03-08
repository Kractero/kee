<script lang="ts">
	export let bindValue: string;
	export let optionsIterable: string[];
</script>

<select
	class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white max-w-24"
	bind:value={bindValue}
>
	{#each optionsIterable as option}
		<option>{option}</option>
	{/each}
</select>
