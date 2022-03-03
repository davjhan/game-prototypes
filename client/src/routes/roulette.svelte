<script lang='ts'>
	import { goto } from '$app/navigation'
	import { lockscroll } from '$common/lockscroll'
	import { onDestroy, setContext } from 'svelte'
	import { spring } from 'svelte/motion'
	import { fade } from 'svelte/transition'
	import { RouletteGameClient, RoulettePhase, SpinPhase } from '../roulette/main'
	import { Sticker } from '../roulette/sticker'
	import StickerView from '../roulette/views/StickerView.svelte'
	import Wheel from '../roulette/views/Wheel.svelte'

	let client = new RouletteGameClient()
	const game = client.store
	setContext('game', client.store)
	setContext('client', client)
	setContext('events', client.events)
	const inertia = spring(1, {
		stiffness: 0.02,
		damping: 0.5,
		precision: 1
	})
	let rotation
	$: rotation = $inertia % 360

	const unsubscribe = client.events.on('phaseChange', onPhaseChange)
	onDestroy(() => unsubscribe())

	function onPhaseChange(next: RoulettePhase, prev: RoulettePhase) {
		if(next.type === 'spin'){
	        const spinPhase = next as SpinPhase
	        $inertia += spinPhase.spinertia + 4000
        }
	}

</script>
<style>
    :global(div) {
        @apply transition-transform;
    }
</style>
<main class='flex  flex-col gap-2 p-4 w-full select-none' use:lockscroll>
    <div class='flex-row self-stretch  relative'>
        <div class='w-0 items-start'>
            <button class='label' on:click={()=>goto('/')}>Exit</button>
        </div>
        <h4 class='flex-grow justify-center'>Round {$game.phase.round + 1}</h4>
        <div class=' items-end absolute right-0'>
            <button class='label primary !px-4 text-xs' on:click={()=>client.gotoSpinPhase()}>Ready!</button>
            <span class='label self-center text-xs mt-0.5' >0.00s</span>
        </div>
    </div>


    <div class='gap-8 mt-2' in:fade={{delay: 150, duration: 300}}>
        <div class='self-center flex-row'>
            <Wheel rotation={rotation} />
        </div>
        {#if $game.phase.type === 'buy'}

            <div class='card flex-grow'>
                <div class='card-header label flex-row items-center'>
                    Buy a sticker
                    <div class='flex-grow'></div>
                    <span class='badge bg-lime-200'>Money: {0}$</span>

                </div>
                <div class=' flex-row '>
                    <div class='flex-col area items-center bg-shade p-2 cursor-pointer active:scale-90'>
                        <span class='label text text-xs text-center'>Sticker</span>
                        <svg viewBox='-10 -10 20 20' class='w-8 h-8 mt-1'>
                            <StickerView sticker={new Sticker(0,0, 'david')} />
                        </svg>
                    </div>
                    <div class='flex-grow'></div>
                    <button class='primary self-center px-8 flex-col gap-0'>

                        <span class='label text-xs'>Buy</span>
                        1$
                    </button>
                </div>

            </div>
        {:else if $game.phase.type === 'spin'}
            <button class='primary self-center px-8 ' on:click={()=>client.gotoBuyPhase()}>Continue</button>
        {/if}

    </div>
</main>