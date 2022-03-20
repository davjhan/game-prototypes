<script lang='ts'>
	import { lockscroll } from '$common/lockscroll'
	import '$roulette/roulette.css'
	import { setContext } from 'svelte'
	import { RouletteGameClient } from '../roulette/main'

	let client = new RouletteGameClient()
	const game = client.store
	setContext('game', client.store)
	setContext('client', client)
	setContext('events', client.events)

</script>
<main class='flex flex-col w-full select-none' use:lockscroll>
    hi
</main>