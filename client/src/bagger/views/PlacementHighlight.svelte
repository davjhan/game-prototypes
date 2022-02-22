<script lang="ts">
	import type { Placement } from '../items'
	import DebugItemView from './DebugItemView.svelte'

	export let model:Placement,size, shadow = false

    let x = model.col * size.item
    let y = model.row * size.item
    let color
    if(shadow) color = '#e5e7eb'
    else if(model.isValid) color = model.item.color
    else color = '#ef4444'
</script>


<div class='bg-shade absolute rounded opacity-50'
     style='width:{size.item}px; height:{size.item}px; transform: translate({x}px, {y}px);'>


    <DebugItemView model={model} {size} {color}/>
</div>