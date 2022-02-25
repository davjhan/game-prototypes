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
<span class='label'>Shop</span>