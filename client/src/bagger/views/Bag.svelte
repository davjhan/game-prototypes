<script lang='ts'>
	import { Game } from '$bagger/main'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/types/runtime/store'
	import DroppableGrid from './DroppableGrid.svelte'

	const game: Writable<Game> = getContext('context')

	function onTransact(e) {
		$game.moveItem(e)
		$game = $game
	}
</script>
<div class='card outlined p-2 border-ink  bg-shade self-center select-none'>
    <div class='card-header -m-2 mb-2  flex-row'>
        <a class=' label underline' on:click={()=>$game.data.bag = []}>Reset</a>
        <div class='flex-grow'></div>
        <span class='label'>Points: {$game.data.points}</span>
    </div>

    <DroppableGrid data={{drawables:$game.data.bag, id:'bag'}} onTransact={onTransact}
                   size={$game.view.bagSize} />
</div>