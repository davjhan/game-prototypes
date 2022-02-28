<script lang='ts'>
	import { EventBus } from '$bagger/eventbus'
	import { block, stripes } from '$bagger/graphics/svg'
	import { GridSize, Layouts } from '$bagger/grids'
	import { DroppablePayloadEvent } from '$bagger/main'
	import DraggableBlock from '$bagger/views/DraggableBlock.svelte'
	import { getContext, onDestroy } from 'svelte'
	import { position } from '../../svelteActions/position'
	import { Block, PlaceAction } from '../blocks'

	export let onTransact, data: { drawables: Block[], id: string }, size: GridSize

	let root
	let placeAction: PlaceAction = undefined
	let events = getContext<EventBus>('events')
	let isValid = false
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
		if (Layouts.isOutOfBounds(gridItem, size.cols, size.rows)) {
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
		const layoutables = [
			placeAction,
			...data.drawables.filter(it => it.id !== placeAction.block.id)
		]
		isValid = (placeAction && !!Layouts.toGrid(layoutables, size.cols, size.rows))
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
        <div class='absolute pointer-events-none'
             use:position={{...drawable,
        cellSize:size.cell}}>
            <DraggableBlock block={drawable.type} parent={data.id} getPayload={()=> drawable} handleOrigin='grabbed'>
                <div>
                    <div style='fill:{drawable.type.color}'
                         class='stroke-2 stroke-ink overflow-visible'>
                        {@html block(drawable.type, size.cell)}
                    </div>

                </div>
                <div slot='baseDragging'>
                </div>
                <div slot='handle'>
                    <div style='fill:{drawable.type.color}'
                         class='stroke-2 stroke-ink overflow-visible drop-shadow-md'>
                        {@html block(drawable.type, size.cell)}
                    </div>
                </div>
            </DraggableBlock>
        </div>
    {/each}

    <div class='overflow-hidden flex-grow pointer-events-none overflow-visible'>
        {#key placeAction}
            {#if placeAction}
                <div class='' use:position={{cellSize:size.cell, ...placeAction}}>
                    <div class='stroke-2 stroke-ink overflow-visible'
                         style='
                            fill:{isValid ? placeAction.block.type.color : `url(#placement-stripes-error)`};

                            '
                    >
                        {@html block(placeAction.block, size.cell)}
                    </div>
                </div>
            {/if}
        {/key}
    </div>
</div>