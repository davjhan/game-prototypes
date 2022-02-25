<script lang='ts'>
	import { LayoutGrid, Size } from '$bagger/cabinet'
	import { EventBus } from '$bagger/eventbus'
	import { render } from '$bagger/itemRenderer'
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
			row: Math.floor((y + size.halfCell) / size.cell),
			col: Math.floor((x + size.halfCell) / size.cell),

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
		if (placeable.row < 0 ||
			placeable.row > size.rows ||
			placeable.col < 0 ||
			placeable.col > size.cols
        ) {

			console.log(`col`, size.cols - 1)
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
    let placementView
    $: if(placement) placementView = render(placement,size, isValid ? `fill-shade-primary` :
                                                            `fill-shade-error stroke-ink-error` )

	const gridCss = `
	    width:${ size.boundsW + 4 }px;
	    height:${ size.boundsH + 4}px;
        background-image: radial-gradient(circle at calc(100% - 2px) calc(100% - 2px), #d1d5db 2px, transparent 0);
        background-size: ${ size.cell }px ${ size.cell }px;
        background-position: 2px 2px;
        `
</script>

<div class='outlined border-ink-secondary' style={gridCss} bind:this={root}>
    {#each data.items as item (item.id)}
        <Item data={{item, parent:data.id}} size={size} />
    {/each}
    <div class='overflow-hidden flex-grow pointer-events-none overflow-visible'>

        {#if shadow}
            <ItemHighlight model={shadow} size={size}
                           />
        {/if}
        {#key placement}
        {#if placement}
            <div class='absolute '
                 style='width:{size.cell}px; height:{size.cell}px; transform: translate({placement.col * size.cell}px, {placement.row
                  * size.cell}px);'>
                {@html placementView}
            </div>

        {/if}
        {/key}
    </div>
</div>