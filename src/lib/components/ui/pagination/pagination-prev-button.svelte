<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'
	import { Pagination as PaginationPrimitive } from 'bits-ui'
	import ChevronLeft from 'lucide-svelte/icons/chevron-left'

	type $$Props = PaginationPrimitive.PrevButtonProps
	type $$Events = PaginationPrimitive.PrevButtonEvents

	let className: $$Props['class'] = undefined
	export { className as class }
</script>

<PaginationPrimitive.PrevButton asChild let:builder>
	<Button
		variant="ghost"
		class={cn('gap-1 pl-2.5', className)}
		builders={[builder]}
		on:click
		{...$$restProps}
	>
		<slot>
			<ChevronLeft class="h-4 w-4" />
			<span class="sr-only">Previous</span>
		</slot>
	</Button>
</PaginationPrimitive.PrevButton>
