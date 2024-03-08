<script>
	import Head from '../../components/Head.svelte';
	import S1S2Card from '../../components/S1S2Card.svelte';
	import S3Card from '../../components/S3Card.svelte';
</script>

<Head title={`Queries - Dev}`} description={"Query cards from the NationStates card game"} />

<div class="flex flex-wrap justify-center">
	<S1S2Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'epic',
			category: 'Frontend Framework',
			flag: './Svelte.png',
			id: 2,
			motto: 'web development, streamlined',
			name: 'SvelteKit',
			region: 'Svelte',
			season: 2,
			type: 'Web Framework'
		}}
		opt="SvelteKit is built on Svelte, a UI framework that uses a compiler to let you write breathtakingly concise components that do minimal work in the browser, using languages you already know — HTML, CSS and JavaScript. It's a love letter to web development."
		url="https://kit.svelte.dev/"
	/>
	<S1S2Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'rare',
			category: 'CSS Framework',
			flag: './Tailwind.png',
			id: 3,
			motto: 'Rapidly build modern websites without ever leaving your HTML.',
			name: 'TailwindCSS',
			region: 'Tailwind Labs',
			season: 2,
			type: 'CSS Utility'
		}}
		opt="A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup."
		url="https://tailwindcss.com/"
	/>
	<S1S2Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'legendary',
			category: 'CSS Components',
			flag: './Shadcn.png',
			id: 1,
			motto: 'Build your component library.',
			name: 'shadcn/ui',
			region: 'shadcn',
			season: 2,
			type: 'CSS Components'
		}}
		opt="Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source."
		url="https://ui.shadcn.com/"
	/>
</div>
<div class="flex flex-wrap justify-center">
	<S1S2Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'common',
			category: 'SQL Database',
			flag: './Sqlite.png',
			id: 4,
			motto: "The World's Most Advanced Open Source Relational Database.",
			name: 'SQLite',
			region: 'SQLite Consortium',
			season: 1,
			type: 'Database'
		}}
		opt="SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inside countless other applications that people use every day."
		url="https://www.sqlite.org/index.html"
	/>
	<S1S2Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'rare',
			category: 'Data Cache',
			flag: './Redis.png',
			id: 5,
			motto: 'A vibrant, open source database ',
			name: 'Redis',
			region: 'Redis Ltd',
			season: 1,
			type: 'In-Memory Data Store'
		}}
		opt="The open source, in-memory data store used by millions of developers as a database, cache, streaming engine, and message broker."
		url="https://redis.io/"
	/>
	<S1S2Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'uncommon',
			category: 'Web Framework',
			flag: './Express.png',
			id: 6,
			motto: 'Fast, unopinionated, minimalist web framework for Node.js',
			name: 'Express',
			region: 'Node.js Foundation',
			season: 1,
			type: 'Node.js Web Framework'
		}}
		opt="Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications."
		url="https://expressjs.com/"
	/>
</div>
<div class="flex flex-wrap justify-center">
	<S3Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'rare',
			category: 'Containers',
			flag: './Docker.png',
			id: 7,
			motto: 'Develop faster. Run anywhere.',
			name: 'Docker',
			region: 'Docker Inc',
			season: 3,
			type: 'Virtualization'
		}}
		opt="Accelerate how you build, share, and run modern applications. Docker makes development efficient and predictable."
		url="https://www.docker.com/"
	/>
	<S3Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'epic',
			category: 'Continuous Integration',
			flag: './GithubActions.png',
			id: 8,
			motto: 'Automate your workflow from idea to production',
			name: 'GitHub Actions',
			region: 'GitHub',
			season: 3,
			type: 'Development Workflow'
		}}
		opt="GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD."
		url="https://docs.github.com/en/actions"
	/>
	<S3Card
		card={{
			badges: {},
			description: '',
			trophies: {},
			cardcategory: 'legendary',
			category: 'Cloud Provider',
			flag: './Hetzner.png',
			id: 9,
			motto: 'Experience the Hetzner Cloud difference!.',
			name: 'Hetzner',
			region: 'Hetzner',
			season: 3,
			type: 'Virtual Private Server'
		}}
		opt="A little money gets you lots of cloud. Flexible cloud servers with high-end-hardware."
		url="https://www.hetzner.com/"
	/>
</div>
