<!--suppress JSSuspiciousNameCombination -->
<script lang='ts'>
	import { getContext } from 'svelte'
	import { Writable } from 'svelte/store'
	import { RouletteGameClient, RouletteGameModel } from '../main'
	import { ProductSelection } from '../shop'
	import Sticker from './StickerView.svelte'

	export let rotation = 0, selectedProduct: ProductSelection | undefined

	const game = getContext<Writable<RouletteGameModel>>('game')
	$: phase = $game.phase
	const client = getContext<RouletteGameClient>('client')
</script>
<svg class='overflow-visible  z-20' class:cursor-pointer={selectedProduct} height='250' stroke='black'
     stroke-width='2'
     viewBox='-100 -100 200 200'
     width='250'
>

    <g class='' transform='rotate({rotation}  )'>
        <circle cx='0' cy='0' fill='white' r='100' vector-effect='non-scaling-stroke' />
        <circle cx='0' cy='0' fill='black' r='4' vector-effect='non-scaling-stroke' />
        <g>
            {#each phase.stickers as sticker}
                <g transform='translate({sticker.x} {sticker.y})'
                   class:opacity-40={selectedProduct}
                   class=''>
                    <Sticker {sticker} />
                </g>

            {/each}
            {#if selectedProduct && selectedProduct.show }
                <g transform='translate({selectedProduct.x} {selectedProduct.placed? selectedProduct.y :
                selectedProduct.y-8})'
                   class:opacity-20={!selectedProduct.isValid}
                   class='cursor-pointer '>
                    {#if !selectedProduct.placed}
                        <circle r='{selectedProduct.radius}'
                                stroke-dasharray='4 4'
                                cy='8'
                                fill='none' />
                    {/if}
                    <Sticker sticker={selectedProduct} selected />
                </g>
            {/if}
        </g>
    </g>

    <path d='M -6 -106 l 12 0 l -6 12' fill='black' stroke-linejoin='round'></path>
</svg>