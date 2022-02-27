<script lang='ts'>
	import { EventBus } from '$bagger/eventbus'
	import { render } from '$bagger/itemRenderer'
	import { DroppablePayloadEvent } from '$bagger/main'
	import { GridSize, LayoutGrid } from '$bagger/grids'
	import DraggableBlock from '$bagger/views/DraggableBlock.svelte'
	import { getContext, onDestroy } from 'svelte'
	import { position } from '../../svelteActions/position'
	import { Block, PlaceAction } from '../blocks'

	export let onTransact, data: { drawables: Block[], id: string }, size: GridSize

	let root
	let placeAction: PlaceAction = undefined
	let shadow: PlaceAction = undefined
	let events = getContext<EventBus>('events')

	const unsubscribeDragEvent = events.subscribe('onDrag', (e: DroppablePayloadEvent<Block>) => {
		const bounds = root.getBoundingClientRect()
		const x = e.x - bounds.x
		const y = e.y - bounds.y
		const drawable = {
			row: Math.floor((y + size.halfCell) / size.cell),
			col: Math.floor((x + size.halfCell) / size.cell),

			layout: e.payload.layout
		}
		if (placeAction && (drawable.row === placeAction.row && drawable.col === placeAction.col)) {
			return
		}
		if (e.from === data.id) {
			shadow = new PlaceAction({
				block: e.payload,
				row: e.payload.row,
				col: e.payload.col,
				from: e.from,
				to: data.id
			})
		}
		if (drawable.row < 0 ||
			drawable.row + drawable.layout.length -1 > size.rows - 1 ||
			drawable.col < 0 ||
			drawable.col + drawable.layout[0].length -1 > size.cols - 1
		) {
            /* Out of bounds */
			placeAction = undefined
		} else {
			const newPlacement = new PlaceAction({
				block: e.payload,
				row: drawable.row,
				col: drawable.col,
				from: e.from,
				to: data.id
			})
			if (placeAction != newPlacement) placeAction = newPlacement
		}
	})

	$: isValid = placeAction ? LayoutGrid.layoutItems(
		[{...placeAction.block, layout:placeAction.layout, row:placeAction.row, col:placeAction.col} ,
    ...data.drawables.filter(it =>
            it.id !==
            placeAction.block.id)],
		size.cols,
		size.rows,
	) : undefined

	const unsubscribeDropEvent = events.subscribe('onDrop', () => {
		shadow = undefined
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
    <div class='absolute'>
        {#each data.drawables as drawable (drawable.id)}
            <DraggableBlock block={drawable.type} parent={data.id} getPayload={()=> drawable}>
                <div class='absolute' use:position={{...drawable, cellSize:size.cell}}>
                    {@html render(drawable.type, size.cell, '', drawable.type.color)}
                </div>

                <div slot='baseDragging'>
                </div>
                <div slot='handle' >
                    {@html render(drawable.type, size.cell, 'rotate-2 drop-shadow-md ',
                        drawable.type.color)}
                </div>
            </DraggableBlock>
        {/each}
    </div>

    <div class='overflow-hidden flex-grow pointer-events-none overflow-visible'>

<!--        {#if shadow && !placeAction}-->
<!--            <div use:position={{cellSize:size.cell, ...shadow}}>-->
<!--                {@html render(shadow.block, size.cell, isValid ? 'fill-shade-success' : 'fill-shade-error',-->
<!--                    shadow.block.type.color)}-->
<!--            </div>-->
<!--        {/if}-->
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