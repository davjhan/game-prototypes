<script lang=ts>
	import type { Placeable } from '../items'

	export let model:Placeable, size, color = model['color'] ?? '#f1f5f9'
    export let clazz = ''
</script>

<div class='relative '>
    {#each model.layout as layoutRows, r}
        {#each layoutRows as layoutCell, c}
            {#if layoutCell}
                <div class='absolute rounded {clazz}'
                     style='width:{size.cell}px; height:{size.cell}px;
                     background-color:{color};
                            transform:translate({c*size.cell}px, {r*size.cell}px)'
                ></div>
            {/if}
        {/each}
    {/each}
</div>