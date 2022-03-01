<script lang='ts'>
	import { goto } from '$app/navigation'
	import { eventBus } from '$bagger/eventbus'
	import { stripes } from '$bagger/graphics/svg'
	import { Game } from '$bagger/main'
	import Bag from '$bagger/views/Bag.svelte'
	import Shop from '$bagger/views/Shop.svelte'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { lockscroll } from '../bagger/utils/actions/lockscroll'

	let game = new Game()

	setContext('context', writable(game))

	setContext('events', eventBus())
</script>


<main class='flex  flex-col gap-2 py-2 ' use:lockscroll>
    <!--    <div class='my-1 self-center'>-->
    <!--        <span class='label'>Game</span>-->
    <!--    </div>-->

    <div class='gap-2 self-center'>
        <Shop />

        <Bag />
    </div>
    <div class='mt-8 '>
        <button on:click={()=>goto('/')}>Exit</button>
    </div>
</main>