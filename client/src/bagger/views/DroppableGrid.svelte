<script lang='ts'>
	import { EventBus } from '$bagger/eventbus'
	import { GridSize, isOutOfBounds, Layouts } from '$bagger/grids'
	import { render } from '$bagger/itemRenderer'
	import { DroppablePayloadEvent } from '$bagger/main'
	import DraggableBlock from '$bagger/views/DraggableBlock.svelte'
	import { getContext, onDestroy } from 'svelte'
	import { position } from '../../svelteActions/position'
	import { Block, PlaceAction } from '../blocks'

	export let onTransact, data: { drawables: Block[], id: string }, size: GridSize

	let root
	let placeAction: PlaceAction = undefined
	let events = getContext<EventBus>('events')
	let isValid
	const unsubscribeDragEvent = events.subscribe('onDrag', (e: DroppablePayloadEvent<Block>) => {
		const bounds = root.getBoundingClientRect()
		const x = e.x - bounds.x
		const y = e.y - bounds.y
		const gridItem = {
			row: Math.floor((y + size.halfCell) / size.cell),
			col: Math.floor((x + size.halfCell) / size.cell),
			layout: e.payload.layout
		}
		if (placeAction && (gridItem.row === placeAction.row && gridItem.col === placeAction.col)) {
			return
		}
		if (Layouts.isOutOfBounds(gridItem, size.cols,size.rows)) {
            /* Out of bounds */
			placeAction = undefined
		} else {
			const newPlacement = new PlaceAction({
				block: e.payload,
				row: gridItem.row,
				col: gridItem.col,
				from: e.from,
				to: data.id
			})
			if (placeAction != newPlacement) placeAction = newPlacement
		}
	})

	$:if (placeAction) {
		const layoutables = data.drawables.map(it => {
			if (it.id === placeAction.block.id) return {
				layout: it.layout,
				row: placeAction.row,
				col: placeAction.col
			}
			else return it
		})
		isValid = placeAction ? Layouts.toGrid(layoutables, size.cols, size.rows) : undefined
	}

	const unsubscribeDropEvent = events.subscribe('onDrop', () => {
		if (!placeAction || !isValid) {
			placeAction = undefined
			return
		}
		onTransact(placeAction)
		placeAction = undefined
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

    {#each data.drawables as drawable (drawable.id)}
        <div class='absolute' use:position={{...drawable, cellSize:size.cell}}>
            <DraggableBlock block={drawable.type} parent={data.id} getPayload={()=> drawable} handleOrigin='grabbed'>
                <div>
                    {@html render(drawable.type, size.cell, '', drawable.type.color)}
                </div>

                <div slot='baseDragging'>
                </div>
                <div slot='handle'>
                    {@html render(drawable.type, size.cell, 'rotate-2 drop-shadow-md ',
                        drawable.type.color)}
                </div>
            </DraggableBlock>
        </div>
    {/each}

    <div class='overflow-hidden flex-grow pointer-events-none overflow-visible'>
        {#key placeAction}
            {#if placeAction}
                <div class='opacity-60'
                     use:position={{cellSize:size.cell, ...placeAction}}>
                    {@html render(placeAction.block, size.cell, isValid ? '' : 'fill-shade-error',
                        placeAction.block.type.color)}
                </div>
            {/if}
        {/key}
    </div>
</div>