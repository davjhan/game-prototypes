<script>
    import { onDestroy, onMount } from 'svelte'
    import Sprite from '../gameRoom/Sprite.svelte'
    const horTiles = 5
    const vertTiles = 5

    let orange

    onMount(()=>{

    })
    const updateLoopId = setInterval(update,100)
    onDestroy(()=>{
        clearInterval(updateLoopId)
    })
    function update(e){
        orange.move(1,1)
    }
</script>
<main class='p-4 flex-grow'>
    <div class='card outlined relative bg-shade flex-grow' style='height: 400px'>

        <Sprite>🐓</Sprite>
        <Sprite bind:this={orange}>🍊</Sprite>
    </div>
</main>