<script lang='ts'>
	import { goto } from '$app/navigation'
	import { lockscroll } from '$common/lockscroll'
	import { onDestroy, setContext } from 'svelte'
	import { spring } from 'svelte/motion'
	import { fade } from 'svelte/transition'
	import { RouletteGameClient, RoulettePhase, SpinPhase } from '../roulette/main'
	import BuyScreen from '../roulette/views/BuyScreen.svelte'
	import BuyWheel from '../roulette/views/BuyWheel.svelte'

	let client = new RouletteGameClient()
	const game = client.store
	setContext('game', client.store)
	setContext('client', client)
	setContext('events', client.events)
	const inertia = spring(90, {
		stiffness: 0.02,
		damping: 0.5,
		precision: 1
	})
	let rotation
	$: rotation = $inertia % 360

	const unsubscribe = client.events.on('phaseChange', onPhaseChange)
	onDestroy(() => unsubscribe())

	function onPhaseChange(next: RoulettePhase, prev: RoulettePhase) {
		if (next.type === 'spin') {
			const spinPhase = next as SpinPhase
			$inertia += spinPhase.spinertia + 4000
		}
	}

</script>
<main class='flex  flex-col  w-full select-none' use:lockscroll>
    <div class='flex-row self-stretch  px-4 pt-4  relative'>
        <div class='w-0 items-start'>
            <button class='label' on:click={()=>goto('/')}>Exit</button>
        </div>
        <div class='flex-col flex-grow justify-center items-center'>
            <h4 class=''>Round {$game.phase.round + 1}</h4>
        </div>


    </div>


    <div class='flex-grow' in:fade={{delay: 150, duration: 300}}>

        {#if $game.phase.type === 'buy'}

            <BuyScreen />
        {:else if $game.phase.type === 'spin'}
            <div class='self-center flex-row mb-8'>
                <BuyWheel rotation={rotation} />
            </div>
            <button class='primary self-center px-8 ' on:click={()=>client.gotoBuyPhase()}>Continue</button>
        {/if}

    </div>
</main>