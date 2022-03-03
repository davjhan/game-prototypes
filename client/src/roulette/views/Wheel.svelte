<script lang='ts'>
	import { getContext } from 'svelte'
	import { Writable } from 'svelte/store'
	import { RouletteGameModel } from '../main'
	import Sticker from './StickerView.svelte'

	export let rotation = 70

	const game = getContext<Writable<RouletteGameModel>>('game')


</script>

<svg viewBox='0 0 340 340' width='340' height='340' class='overflow-visible'
     stroke-width='2'
     stroke='black'>
    <g transform='rotate({rotation} 170 170)'>
        <circle r='170' fill='white' cx='170' cy='170' vector-effect='non-scaling-stroke'>

        </circle>
        <circle r='4' fill='black' cx='170' cy='170' vector-effect='non-scaling-stroke' />

        <g transform='translate(170 170), scale( {170/100} )'>
            {#each $game.stickers as sticker}
                <g transform='translate({sticker.shape.c.x} {sticker.shape.c.y})' class='cursor-pointer'>
                    <Sticker {sticker} />
                </g>

            {/each}
        </g>

    </g>

</svg>