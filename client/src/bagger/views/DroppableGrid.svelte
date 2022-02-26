<script lang='ts'>
	import { Drawable } from '$bagger/drawable'
	import { EventBus } from '$bagger/eventbus'
	import { render } from '$bagger/itemRenderer'
	import { DroppablePayloadEvent } from '$bagger/main'
	import { GridSize, LayoutGrid } from '$bagger/tileLayout'
	import ShopItem from '$bagger/views/DraggableBlock.svelte'
	import { getContext, onDestroy } from 'svelte'
	import { position } from '../../svelteActions/position'
	import { Block, PlacementDrawable } from '../blocks'

	export let onTransact, data: { drawables: Block[], id: string }, size: GridSize

	let root
	let placement: PlacementDrawable = undefined
	let shadow: PlacementDrawable = undefined
	let events = getContext<EventBus>('events')

	const unsubscribeDragEvent = events.subscribe('onDrag', (e: DroppablePayloadEvent<Block>) => {
		const bounds = root.getBoundingClientRect()
		const x = e.x - bounds.x
		const y = e.y - bounds.y
		const drawable: Drawable = {
			row: Math.floor((y + size.halfCell) / size.cell),
			col: Math.floor((x + size.halfCell) / size.cell),

			layout: e.payload.layout
		}
		if (placement && (drawable.row === placement.row && drawable.col === placement.col)) {
			return
		}
		if (e.from === data.id) {
			shadow = new PlacementDrawable({
				item: e.payload,
				row: e.payload.row,
				col: e.payload.col,
				from: e.from,
				to: data.id
			})
		}
		if (drawable.row < 0 ||
			drawable.row > size.rows - 1 ||
			drawable.col < 0 ||
			drawable.col > size.cols - 1
		) {
            /* Out of bounds */
			placement = undefined
		} else {
			const newPlacement = new PlacementDrawable({
				item: e.payload,
				row: drawable.row,
				col: drawable.col,
				from: e.from,
				to: data.id
			})
			if (placement != newPlacement) placement = newPlacement
		}
	})

	$: isValid = placement ? LayoutGrid.layoutItems(
		[placement, ...data.drawables.filter(it => it.id !== placement.target.id)],
		size.rows,
		size.cols
	) : undefined

	const unsubscribeDropEvent = events.subscribe('onDrop', () => {
		shadow = undefined
		if (!placement || !isValid) {
			placement = undefined
			return
		}
		onTransact(placement)
		placement = undefined
	})

	onDestroy(() => {
		unsubscribeDragEvent()
		unsubscribeDropEvent()
	})

	const gridCss = `
	    width:${ size.boundsW }px;
	    height:${ size.boundsH }px;
        background-image: radial-gradient(circle at calc(100% - 2px) calc(100% - 2px), #d1d5db 2px, transparent 0);
        background-size: ${ size.cell }px ${ size.cell }px;
        background-position: 4px 4px;
        padding: 2px 0 0 2px;
        `
</script>

<div bind:this={root} class='overflow-visible' style={gridCss}>
    <div class='absolute'>
        {#each data.drawables as drawable (drawable.id)}
            <ShopItem block={drawable.block} parent={data.id} getPayload={()=> drawable}>
                <div class='absolute' use:position={{...drawable, cellSize:size.cell}}>
                    {@html render(drawable.block, size.cell, '', drawable.block.color)}
                </div>

                <div slot='baseDragging'>
                </div>
                <div slot='handle'>
                    {@html render(drawable.block, size.cell, '', drawable.block.color)}
                </div>
            </ShopItem>
        {/each}
    </div>

    <div class='overflow-hidden flex-grow pointer-events-none overflow-visible'>

        {#if shadow && !placement}
            <div use:position={{cellSize:size.cell, ...shadow}}>
                {@html render(shadow.target, size.cell, isValid ? 'fill-shade-success' : 'fill-shade-error',
                    shadow.target.block.color)}
            </div>
        {/if}
        {#key placement}
            {#if placement}
                <div class='opacity-60'
                     use:position={{cellSize:size.cell, ...placement}}>
                    {@html render(placement.target, size.cell, isValid ? '' : 'fill-shade-error',
                        placement.target.block.color)}
                </div>
            {/if}
        {/key}
    </div>
</div>