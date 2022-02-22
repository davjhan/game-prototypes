<script lang="ts">
	import { draggable } from '@neodrag/svelte'
	import { getContext } from 'svelte'
	import DebugItemView from './DebugItemView.svelte'

	export let item, size
    $: x = item.col * size.item + 0.001
    $: y = item.row * size.item + 0.001

    const onItemDrag = getContext('onItemDrag')
    const onItemDrop = getContext('onItemDrop')

    function onDrag(e) {
        x = e.offsetX
        y = e.offsetY

	    onItemDrag({
            x:e.domRect.x ,
            y:e.domRect.y ,
            item
        })
    }

    function onDragEnd(e) {
	    if (!onItemDrop()){
			item.col = item.col
            item.row = item.row
        }
    }

</script>

<div class=' absolute rel select-none cursor-pointer '
     style='width:{size.item}px; height:{size.item}px;'
     use:draggable={{
         position: { x, y },
         defaultClassDragging: 'z-10',
         onDrag,
         onDragEnd,
     }}
>
    <DebugItemView model={item} {size} />
</div>