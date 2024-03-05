<script lang="ts">
	import { badges } from '$lib/badges';
	import { cardcategory } from '$lib/cardcategory';
	import { category } from '$lib/category';
	import { flags } from '$lib/flags';
	import { buildCards } from '$lib/helpers/buildCards';
	import { parameters } from '$lib/parameters';
	import { trophies } from '$lib/trophies';

	buildCards("Kractero", ["67193", '3293', '65901', '71582'], ["Kractero"], ["Kractero"])

	let clauses: any = [
		{
			qualifier: '',
			whereValue: 'type',
			conditionValue: 'IS',
			badgeTrophyValue: '',
			input: '🌸 Pinktastic 🐾 Coffee ☕ Loving 💕 Grand 🧀 Dutchy 🌷 Queendom 👑',
			trophyPercentage: ''
		}
	];
	let qualifier = 'AND';
	let selectValue = 'S3';
	let queryWhereValue = '*';
	let inputs: string[] = [''];
	let queryResult = '';

	function addClause() {
		clauses = [
			...clauses,
			{ qualifier: qualifier, whereValue: '', conditionValue: '', badgeTrophyValue: '', input: '', trophyPercentage: '' }
		];
		inputs.push('');
	}

	async function buildQuery() {
		const queyr = {
			mainWhereValue: queryWhereValue,
			table: selectValue,
			clauses: clauses
		};

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: queyr })
		};

		try {
			// Send the request to the Express server
			const response = await fetch('http://localhost:3000/ui', requestOptions);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Parse the response
			const data = await response.json();

			// Do something with the response data
			console.log(data);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<h1>Sideroca</h1>

<p>SELECT</p>
<select bind:value={selectValue}>
	<option>S1</option>
	<option>S2</option>
	<option>S3</option>
</select>

Add new <select bind:value={qualifier}><option>AND</option><option>OR</option></select> clause
<button on:click={addClause}>+</button>

{#each clauses as clause}
	{#if clause.qualifier}
		<p>{clause.qualifier}</p>
	{/if}
	<select bind:value={clause.whereValue}>
		{#each selectValue === 'S1' ? parameters : parameters.filter((param) => param !== 'exnation') as parameter}
			<option>{parameter}</option>
		{/each}
	</select>
	{#if clause.whereValue !== 'exnation'}
		{#if ['badges', 'trophies'].includes(clause.whereValue)}
			<p>JSON_EXTRACT {clause.whereValue}</p>
			<select bind:value={clause.conditionValue}>
				<option>IS</option>
				<option>IS NOT</option>
				<option>HAS NO</option>
			</select>
			{#if clause.conditionValue !== 'HAS NO'}
				{#if clause.whereValue === "badges"}
				<select bind:value={clause.badgeTrophyValue}>
					{#each badges as badge}
						<option>{badge}</option>
					{/each}
				</select>
				{/if}
				{#if clause.whereValue === "trophies"}
				<select bind:value={clause.badgeTrophyValue}>
					{#each trophies as trophy}
						<option>{trophy}</option>
					{/each}
				</select>
				<select bind:value={clause.trophyPercentage}>
					{#each ['1T', '1', '5', '10'] as trophy}
						<option>{trophy}</option>
					{/each}
				</select>
				{/if}
			{:else}
				<p>badges</p>
			{/if}
		{/if}
		{#if !['badges', 'trophies'].includes(clause.whereValue)}
			<select bind:value={clause.conditionValue}>
				{#if clause.whereValue !== 'flag'}
					<option>IS</option>
                    <option>IS NOT</option>
				{/if}
				{#if !['cardcategory', 'category'].includes(clause.whereValue)}
					<option>LIKE</option>
					<option>NOT LIKE</option>
				{/if}
			</select>
			{#if clause.whereValue === 'flag'}
				<select bind:value={clause.input}>
					{#each flags as flag}
						<option>{flag}</option>
					{/each}
				</select>
			{:else if clause.whereValue === 'cardcategory'}
				<select bind:value={clause.input}>
					{#each cardcategory as rarity}
						<option>{rarity}</option>
					{/each}
				</select>
            {:else if clause.whereValue === 'category'}
				<select bind:value={clause.input}>
					{#each category as government}
						<option>{government}</option>
					{/each}
				</select>
			{:else}
				<input bind:value={clause.input} />
			{/if}
		{/if}
	{/if}
{/each}

<button on:click={buildQuery}>Compute</button>

<p>{queryResult}</p>
