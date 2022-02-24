<script lang=ts>
	import type { Placeable } from '../items'

	export let model:Placeable, size, color = model['color'] ?? '#f1f5f9'
    export let clazz = ''
</script>

<div class='relative animate-wiggle'>
    {#each model.layout as layoutRows, r}
        {#each layoutRows as layoutCell, c}
            {#if layoutCell}
                <div class='absolute rounded {clazz}'
                     style='width:{size.item}px; height:{size.item}px;
                     background-color:{color};
                            transform:translate({c*size.item}px, {r*size.item}px)'
                ></div>
            {/if}
        {/each}
    {/each}
</div>