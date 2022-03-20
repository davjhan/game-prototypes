<script>
    import { goto } from '$app/navigation'
</script>
<main class='p-4 flex flex-col items-center gap-4 justify-center '>
    <h2>Game Prototypes</h2>
    <span>By David Han</span>
    <div class='mt-12  gap-4 self-stretch '>
        <div class='flex-row '>
            <h3>Packing Game</h3>
            <div class='flex-grow'></div>
            <button class='primary ' on:click={()=>goto('/bagger')}>Play</button>
        </div>
        <div class='flex-row self-stretch '>
            <h3 class='flex-grow'> Roulette</h3>
            <button class='primary ' on:click={()=>goto('/roulette')}>Play</button>
        </div>
        <div class='flex-row self-stretch '>
            <h3 class='flex-grow'> Stars</h3>
            <button class='primary ' on:click={()=>goto('/stars')}>Play</button>
        </div>
    </div>


</main>