<script>
    import { goto } from '$app/navigation'
</script>
<main class='p-4 flex flex-col items-center gap-4 justify-center h-screen'>
    <h1>Game Prototypes</h1>
    <span>By David Han</span>
    <div class='mt-12  gap-4 self-stretch '>
        <div class='flex-row '>
            <h2>Packing Game</h2>
            <div class='flex-grow'></div>
            <button class='primary ' on:click={()=>goto('/bagger')}>Play</button>
        </div>
        <div class='flex-row self-stretch '>
            <h2 class='flex-grow'> Roulette</h2>
            <button class='primary ' on:click={()=>goto('/roulette')}>Play</button>
        </div>
    </div>


</main>