<script lang='ts'>
	import { LayoutGrid, Size } from '$bagger/cabinet'
	import { EventBus } from '$bagger/eventbus'
	import { DragEvent, Game, GameDataModel, GameViewModel } from '$bagger/main'
	import Item from '$bagger/views/Item.svelte'
	import { getContext, onDestroy } from 'svelte'
	import { Item as ItemModel, Placeable, Placement } from '../items'
	import ItemHighlight from './PlacementHighlight.svelte'

	export let onTransact, data: { items: ItemModel[], id: string }, size: Size

	let root
	let placement = undefined
	let shadow = undefined
	let events = getContext<EventBus>('events')

	const unsubscribeDragEvent = events.subscribe('onDrag', (e: DragEvent) => {
		const bounds = root.getBoundingClientRect()
		const x = e.x - bounds.x
		const y = e.y - bounds.y
		const placeable: Placeable = {
			row: Math.floor((y + size.halfItem) / size.item),
			col: Math.floor((x + size.halfItem) / size.item),

			layout: e.item.layout
		}
		if(placement && (placeable.row === placement.row && placeable.col === placement.col)){
			return
        }
		if (e.from === data.id) {
			shadow = new Placement({
				item: e.item,
				row: e.item.row,
				col: e.item.col,
				from: e.from,
				to: data.id
			})
		}
		console.log(`PLE`, placement)
		if (placeable.row < 0 ||
			placeable.row > size.rows - 1 ||
			placeable.col < 0 ||
			placeable.col >
			size.cols - 1) {
            /* Out of bounds */
			placement = undefined
		} else {
			const newPlacement = new Placement({
				item: e.item,
				row: placeable.row,
				col: placeable.col,
				from: e.from,
				to: data.id
			})
			console.log(`placemenrTT`, placement)
			if (placement != newPlacement) placement = newPlacement
		}
	})

	$: isValid = placement ? LayoutGrid.layoutItems(
		[placement, ...data.items.filter(it => it !== placement.item)],
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
		placement = null
	})

	onDestroy(() => {
		unsubscribeDragEvent()
		unsubscribeDropEvent()
	})

	const gridCss = `
	    width:${ size.boundsW }px;
	    height:${ size.boundsH }px;
        background-image: radial-gradient(circle at calc(100% - 2px) calc(100% - 2px), #d1d5db 2px, transparent 0);
        background-size: ${ size.item }px ${ size.item }px;
        background-position: 2px 2px;
        `
</script>

<div class='outlined ' style={gridCss} bind:this={root}>
    {#each data.items as item (item.id)}
        <Item data={{item, parent:data.id}} size={size} />
    {/each}
    <div class='overflow-hidden flex-grow pointer-events-none'>

        {#if shadow}
            <ItemHighlight model={shadow} size={size}
                           shadow={true} />
        {/if}
        {#key placement}
        {#if placement}
            <ItemHighlight model={{...placement, isValid}} size={size} />
        {/if}
        {/key}
    </div>
</div>