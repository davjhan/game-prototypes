<script lang='ts'>
	import { Block, BlockType } from '$bagger/blocks'
	import { EventBus } from '$bagger/eventbus'
	import { DroppablePayloadEvent, Game } from '$bagger/main'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/types/runtime/store'
	import { drag, DragEvent } from '../../svelteActions/draggable'
	import { position } from '../../svelteActions/position'

	export let block: BlockType, parent, getPayload: () => Block
	const events = getContext<EventBus>('events')
	const game: Writable<Game> = getContext('context')
	let dragging
	let x, y

	function computePosition(e: DragEvent) {
		const offset = e.detail.type.startsWith('touch') ? 32 : 0
		return [
			e.detail.x - block.layout[0].length * $game.view.bagSize.halfCell,
			e.detail.y - block.layout.length * $game.view.bagSize.halfCell - offset,
		]
	}

	function itemDragStart(e: DragEvent) {
		[x, y] = computePosition(e)
		dragging = true
	}

	function itemDragging(e: DragEvent) {
		[x, y] = computePosition(e)
		events.dispatch<DroppablePayloadEvent<Block>>('onDrag', {
			x,
			y,
			payload: getPayload(),
			from: parent
		})
	}

	function itemDragEnd(e) {
		dragging = undefined
		x = undefined
		y = undefined
		events.dispatch('onDrop')
	}

</script>

<div
        class='cursor-pointer'
        on:drag-end={itemDragEnd}
        on:drag-start={itemDragStart}
        on:dragging={itemDragging}
        use:drag
>
    <div class={$$slots.baseDragging && dragging ? 'invisible': ''}>
        <slot />
    </div>
    {#if $$slots.baseDragging && dragging}
        <slot name='baseDragging'></slot>
    {/if}
</div>
{#if dragging}
    <div class='fixed top-0 left-0 z-10 cursor-grab fill-ink' use:position={{x,y}}>
        {#if $$slots.handle}
            <slot name='handle'></slot>
        {:else}
            <slot></slot>
        {/if}
    </div>
{/if}