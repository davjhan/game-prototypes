<script lang='ts'>
	import { draggable } from '@neodrag/svelte'

	export let x = 0, y = 0

	export function move(dx: number, dy: number) {
		x += dx
		y += dy
	}

	$: draggableOptions= {
		bounds: 'parent',
        position: {x,y},
		onDrag: function onDrag(e) {
			if (e.offsetX) x = e.offsetX
			if (e.offsetY) y = e.offsetY
		},
	}
</script>

<div class='select-none cursor-pointer absolute'
     use:draggable={draggableOptions}
>
    <span class='text-3xl'>
        <slot />
    </span>
</div>