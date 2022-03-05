<script lang='ts'>
	import { Sticker } from '../sticker'
	import StickerView from './StickerView.svelte'

	export let sticker: Sticker, selected: boolean = false, disabled: boolean = false
</script>

<div class='card bg-shade gap-2 p-2 ring-accent' class:animate-bulge={selected}
     class:cursor-pointer={!disabled}
     class:ring={selected}
     class:squishy={!selected && !disabled}
     on:click
>
    <div class='items-center' class:opacity-40={disabled}>
        <span class='text text-center'>{sticker.name}</span>
        <svg class='w-8 h-8 mt-1 ' viewBox='-10 -10 20 20'>
            <StickerView sticker={sticker} />
        </svg>
    </div>
    <div class='bg-white badge border-2 border-ink self-stretch px-4'
         class:bg-red-200={disabled}>{sticker.price}$
    </div>
</div>