<script lang='ts'>
	import { Cabinet as CabinetModel, Size } from '../cabinet'
	import { Dot } from '../items'
	import Cabinet from './Cabinet.svelte'

	// export let onItemDrag
	let model = new CabinetModel([new Dot(0, 0), new Dot(0,1)], new Size(340,2,6))

</script>
<div class='card outlined p-1 border-ink'>
    <span class='card-header -m-1 mb-1 label'>Shop</span>
    <Cabinet model={model} />
</div>