<script lang='ts'>
	import { Dot, ItemDragEvent, Placement, Zag } from '$bagger/items'
	import Cabinet from '$bagger/views/Cabinet.svelte'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { Cabinet as CabinetModel, Size } from '../bagger/cabinet'


	let bag = new CabinetModel('bag', [new Dot(0, 0), new Zag(0, 1)], new Size(340, 4, 6))
	let shop = new CabinetModel('shop', [new Dot(0, 0), new Zag(0, 1)], new Size(340, 4, 6))
	let model = {
		bag,
		shop
	}
	let bagView, shopView
	let placement: { placement:Placement, model, onDrop }
	setContext('onItemDrag', onItemDrag)
	setContext('onItemDrop', onItemDrop)

	function onItemDrag(e: ItemDragEvent) {
		if (!e) return
		const collidingElements: Element[] = document.elementsFromPoint(e.x, e.y)
		if (!collidingElements) return
		for (let cabinet of [bagView, shopView]) {
			placement = cabinet.handleDrag(e, collidingElements)
			if (placement) break
		}
		return placement
	}

	function onItemDrop() {
		placement?.onDrop()
		if (!placement || !placement.placement.isValid) {
			placement = undefined
			model = model
			return
		}
		const existingItem = placement.model.items.find(it => it === placement.placement.item)
		placement.placement.item.row = placement.placement.row
		placement.placement.item.col = placement.placement.col
		if (!existingItem) {
			placement.model.items.push(placement.placement.item)
		}
		model = model
		placement = undefined
		return true
	}
</script>

<main class='flex my-8 flex-col gap-2'>
    <div class='self-center gap-2 '>
        {#key model}
        <!--        <Shop model={shop} bind:this={shopView} {onItemDrag}/>-->
        <!--        <Bag model={bag} bind:this={bagView} />-->
        <Cabinet model={model.bag} bind:this={bagView} />
        <Cabinet model={model.shop} bind:this={shopView} />
        <!--        <Bag model={shop} bind:this={shopView} />-->

            {/key}
    </div>

</main>