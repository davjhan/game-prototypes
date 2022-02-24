<script lang='ts'>
	import { Placement } from '$bagger/items'
	import { Game } from '$bagger/main'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/types/runtime/store'
	import Cabinet from './DroppableGrid.svelte'

	const game:Writable<Game> = getContext('context')
    function onTransact(e){
		$game.moveItem(e)
        $game = $game
    }
</script>
<svelte:options accessors/>
<div class='card outlined p-1 border-ink border-b-3'>
    <span class='card-header -m-1 mb-1 label'>Bag</span>
    <Cabinet data={{items:$game.data.bag, id:'bag'}} size={$game.view.bagSize}
             onTransact={onTransact}/>
</div>