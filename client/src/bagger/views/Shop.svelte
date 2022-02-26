<script lang='ts'>
	import { Block, Dot, Line, Zag } from '$bagger/blocks'
	import { render } from '$bagger/itemRenderer'
	import { Game } from '$bagger/main'
	import ShopItem from '$bagger/views/DraggableBlock.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/types/runtime/store'

	const game: Writable<Game> = getContext('context')

	const shopItems = [new Dot(), new Line(), new Zag()]

</script>
<div class='card'>
    <div class='card-header flex-row'>
        <span class='label'>Shop</span>
        <div class='flex-grow'></div>
        <span class='label text-ink-secondary'> (Drag to buy) </span>
    </div>

    <div class=' flex-row gap-2 '>
        {#each shopItems as product}
            <ShopItem block={product} size={$game.view.bagSize} parent='shop' getPayload={()=> new Block(product)}>
                <div class='p-1 outlined border-ink aspect-square justify-center items-center w-16'>
                    {@html render(product, 24, '', product.color)}
                </div>
                <div slot='handle'>
                    {@html render(product, $game.view.bagSize.cell, '', product.color)}
                </div>
            </ShopItem>
        {/each}

    </div>
</div>