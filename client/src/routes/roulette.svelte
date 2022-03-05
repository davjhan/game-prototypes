<script lang='ts'>
	import { goto } from '$app/navigation'
	import { lockscroll } from '$common/lockscroll'
	import '$roulette/roulette.css'
	import { setContext } from 'svelte'
	import { fade } from 'svelte/transition'
	import { RouletteGameClient } from '../roulette/main'
	import BuyScreen from '../roulette/views/BuyScreen.svelte'
	import SpinScreen from '../roulette/views/SpinScreen.svelte'

	let client = new RouletteGameClient()
	const game = client.store
	setContext('game', client.store)
	setContext('client', client)
	setContext('events', client.events)

</script>
<main class='flex flex-col w-full select-none'  use:lockscroll>
    <div class='relative flex-row mt-4'>
        <div class='items-start w-20'>
            <button class='' on:click={()=>goto('/')}>Exit</button>
        </div>
        <div class='flex-col flex-grow justify-center items-center mr-20'>
            <h4 class=''>Round {$game.phase.round + 1}</h4>
        </div>
    </div>

    <div class='flex-grow' in:fade={{delay: 150, duration: 300}}>
        {#if $game.phase.type === 'buy'}
            <BuyScreen />
        {:else if $game.phase.type === 'spin'}
            <SpinScreen />
        {/if}
    </div>
</main>