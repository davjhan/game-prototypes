<script lang="ts">
	import { render } from '$bagger/itemRenderer'
	import type { Placement } from '../items'
	import DebugItemView from './DebugItemView.svelte'

	export let model:Placement,size

    let x = model.col * size.cell
    let y = model.row * size.cell
    let modelView
	$: if(model) modelView = render(model,size, `fill-white` )
</script>


<div class='bg-shade absolute rounded opacity-50'
     style='width:{size.cell}px; height:{size.cell}px; transform: translate({x}px, {y}px);'>

    {@html modelView}

</div>