<script lang='ts'>
	import { lockscroll } from '$common/lockscroll'
	import { Point, toRad } from '@mathigon/euclid'
	import { square } from '@mathigon/fermat'
	import { getContext, onMount } from 'svelte'
	import { flip } from 'svelte/animate'
	import { Writable } from 'svelte/store'
	import { fly } from 'svelte/transition'
	import { BuyPhase, RouletteGameClient, RouletteGameModel } from '../main'
	import { ProductSelection } from '../shop'
	import { BasicSticker, Sticker } from '../sticker'
	import { flyDefault } from '../transitions'
	import StickerShelfItemView from './StickerShelfItemView.svelte'
	import Wheel from './Wheel.svelte'

	const game = getContext<Writable<RouletteGameModel>>('game')
	const client = getContext<RouletteGameClient>('client')
	const products = [new BasicSticker(0, 0, 'david')]

	let phase = <BuyPhase>$game.phase
	let selectedProduct: ProductSelection | undefined

	function selectProduct(product: Sticker) {
		if (!product) {
			selectedProduct = undefined
			return
		}
		if ($game.money < product.price) return
		if (product.type === selectedProduct?.type) return
		selectedProduct = {
			show: false,
			isValid: false,
			placed: false,
			...product
		}
	}

	let root, wheel, wheelBounds, scale

	const onMouseMove = (e, isTouch = false) => {
		if (!selectedProduct) return
		const point = new Point(
			(e.clientX - wheelBounds.x) / scale - 100,
			(e.clientY - wheelBounds.y) / scale - 100 - (isTouch ? 32 : 10)
		).rotate(-toRad(phase.rotation))
		const isValid = isSelectedProductValid(point.x, point.y, selectedProduct.radius)
		if (isTouch || !selectedProduct.placed) {
			selectedProduct.show = showProduct(point.x, point.y)
			selectedProduct.x = point.x
			selectedProduct.y = point.y
			selectedProduct.isValid = isValid
			selectedProduct.placed = false
		}
	}

	function onMouseDown(e) {
		if (!selectedProduct) return
		selectedProduct.placed = false
		onMouseMove(e)
	}

	function isSelectedProductValid(x, y, radius) {
		return Math.sqrt(square(x) + square(y)) < 100 - radius
	}

	function showProduct(x, y) {
		return Math.sqrt(square(x) + square(y)) < 125
	}

	function onPlace() {
		if (!selectedProduct) return
		if (!selectedProduct.isValid) {
			selectedProduct.show = false
			return
		}
		selectedProduct.placed = true
	}

	onMount(() => {
		wheelBounds = wheel.getBoundingClientRect()
		scale = wheelBounds.width / 200
	})

	function purchase() {
		console.log(`purchase`,)
		if (!selectedProduct) return
		client.buySticker(selectedProduct)
		selectedProduct = undefined
	}
</script>

<div class='px-4 ' use:lockscroll>

    <div class='items-center p-8 pt-4 '
         on:mousedown={onMouseDown}
         on:mouseleave={onMouseMove}
         on:mousemove={onMouseMove}

         on:mouseup={onPlace}
         on:touchend={onPlace}
         on:touchmove|passive={e=> onMouseMove(e.touches[0], true)}
         on:touchstart={e=> onMouseMove(e.touches[0], true)}
    >
        <div bind:this={wheel}>
            <Wheel bind:selectedProduct={selectedProduct} rotation={phase.rotation} />
        </div>
    </div>


    {#if selectedProduct && selectedProduct.placed}
        <div class='flex-row gap-2 self-center items-center mb-4' in:fly={flyDefault}>
            <button class='primary animate-bulge' on:click|preventDefault={purchase}>Buy
                for {selectedProduct.price}$
            </button>
            <button class='primary !bg-red-300 w-20' on:click={()=> selectProduct(undefined)}>Cancel</button>
        </div>
    {:else if selectedProduct && !selectedProduct.placed}
        <div class='flex-row gap-2 self-center items-center mb-4' in:fly={flyDefault}>
            <span class=' '>Tap to place</span>
            <button class='primary !bg-red-300 w-20 '
                    on:click={()=> selectProduct(undefined)}>Cancel
            </button>
        </div>

    {/if}
    <div class='flex-col select-none gap-2' in:fly={flyDefault}>
        <div class='card flex-grow'>
            <div class='card-header mb-2 flex-row items-center'>
                Shop
                <div class='flex-grow'></div>
                <span class='badge bg-lime-200'>Money: {$game.money}$</span>

            </div>
            <div class='items-start'>
                {#each products as product (product.type)}
                    <div animate:flip>
                        <StickerShelfItemView sticker={product} on:click={()=> selectProduct(product)}
                                              disabled={$game.money < product.price}
                                              selected={selectedProduct?.type === product.type}
                        />
                    </div>

                {/each}
            </div>
        </div>
        <div class='flex-row items-center gap-2  self-end'>

            <span class=' mt-0.5'>Spinning in 10s</span>
            <button class='primary'
                    class:animate-bulge={products.every(it => it.price > $game.money)}
                    on:click={()=>client.gotoSpinPhase()}>I'm ready.
            </button>
        </div>

    </div>


</div>