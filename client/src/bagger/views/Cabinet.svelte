<script lang='ts'>
	import { Cabinet } from '../cabinet'
	import { ItemDragEvent, newPlacement, Placement } from '../items'
	import Item from './Item.svelte'
	import ItemHighlight from './PlacementHighlight.svelte'

	export let model: Cabinet
	let root
	let placement = undefined
	console.log(`RENDER`, placement)

	export function handleDrag(e: ItemDragEvent, elements: Element[]) {
		if (!e || !elements.includes(root)){
			placement = undefined
			return
        }
		const bounds = root.getBoundingClientRect()
		const x = e.x - bounds.x
		const y = e.y - bounds.y
		const placeable = {
			row: Math.floor((y + model.size.halfItem) / model.size.item),
			col: Math.floor((x + model.size.halfItem) / model.size.item),

			layout: e.item.layout
		}
		const isValid = model.layoutItems(model.items.map(it => (it === e.item) ? placeable : it)) != undefined
		placement = newPlacement({
			isValid,
			item: e.item,
			row: placeable.row,
			col: placeable.col,
		})
		return {
			placement,
            model,
            onDrop:exitDrag
        }
	}

	export function exitDrag() {
		placement = undefined
	}

	const gridCss = `
	    width:${ model.size.boundsW }px;
	    height:${ model.size.boundsH }px;
        background-image: radial-gradient(circle at calc(100% - 2px) calc(100% - 2px), #d1d5db 2px, transparent 0);
        background-size: ${ model.size.item }px ${ model.size.item }px;
        background-position: 1px 1px;
        `
</script>

<div class='outlined ' style={gridCss} bind:this={root}>
    {#each model.items as item}
        <Item item={item} size={model.size} />
    {/each}
    <div class='overflow-hidden flex-grow pointer-events-none'>
        {#key placement}
            {#if placement}
                <ItemHighlight model={placement.item.toPlacement(true)} size={model.size} shadow={true} />
                <ItemHighlight model={placement} size={model.size} />
            {/if}
        {/key}
    </div>
</div>