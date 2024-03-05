<script lang="ts">
	import { badges } from '$lib/badges';
	import { cardcategory } from '$lib/cardcategory';
	import { category } from '$lib/category';
	import { flags } from '$lib/flags';
	// import { buildCards } from '$lib/helpers/buildCards';
	// buildCards("Kractero", ["67193", '3293', '65901', '71582'], ["Kractero"], ["Kractero"])

	import { parameters } from '$lib/parameters';
	import { trophies } from '$lib/trophies';

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

	function addClause() {
		clauses = [
			...clauses,
			{
				qualifier: qualifier,
				whereValue: '',
				conditionValue: '',
				badgeTrophyValue: '',
				input: '',
				trophyPercentage: ''
			}
		];
		inputs.push('');
	}

	async function buildQuery(event: Event) {
		event.preventDefault();
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
			const response = await fetch('http://localhost:3000/ui', requestOptions);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			console.log(data);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<form on:submit={buildQuery} class="flex flex-col items-center gap-4">
	<div class="flex gap-2 items-center">
		<p>SELECT</p>
		<select class="w-max p-2 text-center" bind:value={queryWhereValue}>
			<option>*</option>
			<option>id, name, season</option>
		</select>	
		<p>FROM</p>
		<select class="p-2" bind:value={selectValue}>
			<option>S1</option>
			<option>S2</option>
			<option>S3</option>
		</select>
	</div>

	<div class="items-center">
		Add new <select bind:value={qualifier}><option>AND</option><option>OR</option></select> clause
		<button type="button" on:click={addClause}>+</button>
	</div>
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
					{#if clause.whereValue === 'badges'}
						<select bind:value={clause.badgeTrophyValue}>
							{#each badges as badge}
								<option>{badge}</option>
							{/each}
						</select>
					{/if}
					{#if clause.whereValue === 'trophies'}
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

	<button type="submit">Compute</button>
</form>