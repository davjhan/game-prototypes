<script lang='ts'>
	import { Cabinet as CabinetModel } from '../cabinet'
	import Cabinet from './Cabinet.svelte'

	export let model:CabinetModel

</script>
<svelte:options accessors/>
<div class='card outlined p-1 border-ink'>
    <span class='card-header -m-1 mb-1 label'>Bag</span>
    <Cabinet model={model} id={'bag'}/>
</div>