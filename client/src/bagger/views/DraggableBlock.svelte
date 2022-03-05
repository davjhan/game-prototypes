<script lang='ts'>
	import { Block, BlockType } from '$bagger/blocks'
	import { EventBus } from '$bagger/eventbus'
	import { DroppablePayloadEvent, Game } from '$bagger/main'
	import { getContext } from 'svelte'
	import Portal from 'svelte-portal/src/Portal.svelte'
	import type { Writable } from 'svelte/types/runtime/store'
	import { drag, DragEvent } from '../utils/actions/draggable'
	import { position } from '../utils/actions/position'

	export let block: BlockType, parent, getPayload: () => Block, handleOrigin = 'center'
	const events = getContext<EventBus>('events')
	const game: Writable<Game> = getContext('context')
	let dragging
	let x, y
	let root, rootBounds, handleOffsetX, handleOffsetY
	let payload

	function computePosition(e: DragEvent) {
		const offset = e.detail.type.startsWith('touch') ? 32 : 0

		if (handleOrigin === 'center') {
			return [
				e.detail.x - (block.layout[0].length * $game.view.bagSize.halfCell),
				e.detail.y - block.layout.length * $game.view.bagSize.halfCell - offset,
			]
		}
		if (handleOrigin === 'grabbed') {
			return [
				e.detail.x - handleOffsetX,
				e.detail.y - handleOffsetY - offset,
			]
		}
	}

	function itemDragStart(e: DragEvent) {
		rootBounds = root.getBoundingClientRect()
		handleOffsetX = e.detail.x - rootBounds.left
		handleOffsetY = e.detail.y - rootBounds.top;

		[x, y] = computePosition(e)
		dragging = true
		payload = getPayload()
	}

	function itemDragging(e: DragEvent) {
		[x, y] = computePosition(e)
		events.dispatch<DroppablePayloadEvent<Block>>('onDrag', {
			x,
			y,
			payload,
			from: parent
		})
	}

	function itemDragEnd() {
		dragging = undefined
		payload = undefined
		x = undefined
		y = undefined
		events.dispatch('onDrop')
	}

</script>

<div
        bind:this={root}
        class='cursor-pointer pointer-events-none'
        on:drag-end={itemDragEnd}
        on:drag-start={itemDragStart}
        on:dragging={itemDragging}
        use:drag
>
    <div class='{$$slots.baseDragging && dragging ? `invisible`: ``}'>
        <slot />
    </div>
    {#if $$slots.baseDragging && dragging}
        <slot name='baseDragging'></slot>
    {/if}
</div>
{#if dragging}
    <Portal>
        <div class='fixed left-0 top-0 z-10 cursor-grab fill-ink' use:position={{x: x,y:y}}>
            {#if $$slots.handle}
                <slot name='handle'></slot>
            {:else}
                <slot></slot>
            {/if}
        </div>
    </Portal>
{/if}