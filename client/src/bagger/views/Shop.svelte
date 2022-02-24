<script lang='ts'>
	import { Game } from '$bagger/main'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/types/runtime/store'
	import Cabinet from './DroppableGrid.svelte'

	const game:Writable<Game> = getContext('context')
	console.log(`VALID`, Object.values($game))
	function onTransact(e){
		$game.moveItem(e)
		$game = $game
	}
</script>
<svelte:options accessors/>
<div class='card outlined p-1 border-ink border-b-3'>
    <span class='card-header -m-1 mb-1 label'>Shop</span>
    <Cabinet data={{items:$game.data.shop, id:'shop'}} size={$game.view.shopSize}
             onTransact={onTransact}/>
</div>