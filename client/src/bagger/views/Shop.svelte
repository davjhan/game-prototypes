<script lang='ts'>
	import { Block, BlockType, colors, Dot, Line, Tee, Zag } from '$bagger/blocks'
	import { block } from '$bagger/graphics/svg'
	import { Game } from '$bagger/main'
	import DraggableBlock from '$bagger/views/DraggableBlock.svelte'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/types/runtime/store'
	import { Luck } from '$common/utils'

	const game: Writable<Game> = getContext('context')

	const shopItems = [new Dot(), new Line(), new Zag(), new Tee()]

	function newItem(type: BlockType) {
		console.log(`NEW ITEM`,)
		return new Block({ ...type, color: Luck.pickRandom(colors) })
	}
</script>

<div class='card'>
    <div class='card-header flex-row'>
        <span class='label'>Shop</span>
        <div class='flex-grow'></div>
        <span class='label text-ink-secondary'> (Drag to buy) </span>
    </div>

    <div class=' flex-row gap-2 '>
        {#each shopItems as product}

            <DraggableBlock block={product} parent='shop' getPayload={()=>new Block(product)}>
                <div
                        class='stroke-2 stroke-ink overflow-visible p-2 area bg-shade items-center h-12 w-12 justify-center pointer-events-auto'
                        style='fill: {product.color}'
                >
                    {@html block(product, 12)}
                </div>
                <div slot='handle' class='stroke-2 stroke-ink overflow-visible drop-shadow-md rotate-3'
                     style='fill: {product.color}'
                >
                    {@html block(product, $game.view.bagSize.cell)}
                </div>
            </DraggableBlock>
        {/each}

    </div>
</div>