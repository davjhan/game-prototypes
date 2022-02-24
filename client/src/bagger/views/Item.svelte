<script lang="ts">
	import { EventBus } from '$bagger/eventbus'
	import { Item } from '$bagger/items'
	import { draggable } from '@neodrag/svelte'
	import { getContext } from 'svelte'
	import DebugItemView from './DebugItemView.svelte'

	export let data:{item:Item, parent:string}, size
    $: x = data.item.col * size.item + 0.001
    $: y = data.item.row * size.item + 0.001
    const events = getContext<EventBus>('events')

    function onDrag(e) {
        x = e.offsetX
        y = e.offsetY

	    events.dispatch('onDrag',{
		    x:e.domRect.x,
		    y:e.domRect.y,
		    item:data.item,
            from:data.parent
	    } as DragEvent)
    }

    function onDragEnd(e) {
		const result = events.dispatch('onDrop')
	    if (!result){
		    data = data
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
    <DebugItemView model={data.item} {size} />
</div>