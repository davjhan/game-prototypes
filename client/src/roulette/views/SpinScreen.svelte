<script lang='ts'>
	import { getContext } from 'svelte'
	import { quartInOut } from 'svelte/easing'
	import { tweened } from 'svelte/motion'
	import { Writable } from 'svelte/store'
	import { RouletteGameClient, RouletteGameModel, SpinPhase } from '../main'
	import Wheel from './Wheel.svelte'

	const game = getContext<Writable<RouletteGameModel>>('game')
	const client = getContext<RouletteGameClient>('client')

	const phase = <SpinPhase>$game.phase
	console.log(`phase`, phase)
	const inertia = tweened(phase.rotation, {
		duration: phase.spinertia*1.5,

		easing: quartInOut,
	})
    $inertia += phase.spinertia
	$: rotation = $inertia % 360
</script>

<div class='px-4 '>

    <div class='p-8 pt-4 items-center'>
        <Wheel rotation={rotation}/>
    </div>
    <button class='primary self-center px-8 ' on:click={()=>client.gotoBuyPhase()}>Continue</button>
</div>