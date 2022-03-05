<script lang='ts'>
	import { Sticker } from '../sticker'

	export let sticker: Sticker, selected: boolean = false
</script>

{#if selected}
    <circle r={sticker.radius + 2}
            stroke='none'
            fill='#fbbf24'
    >
    </circle>
{/if}
<circle fill={sticker.color} r={sticker.radius}
        stroke='black'
        stroke-width='2'
>
</circle>