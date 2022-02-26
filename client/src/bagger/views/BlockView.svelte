<script lang='ts'>
	import { BlockType } from '$bagger/blocks'
	import { render } from '$bagger/itemRenderer'

	export let block: BlockType, cellSize: number
	let clazz = 'fill-white'
	export { clazz as class }
	const background = render(block, cellSize, clazz)
</script>

<div class='absolute '
     style='width:{cellSize}px; height:{cellSize}px;'>
    <!-- transform: translate({x}px, {y}px);-->
    {@html background}
</div>