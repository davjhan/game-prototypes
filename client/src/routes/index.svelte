<script>
import { goto } from '$app/navigation'
</script>
<main class='p-4 flex flex-col items-center gap-4 justify-center h-screen'>
    <h1>Packing Game Prototype</h1>
    <span>By David Han</span>
    <button class='primary mt-12' on:click={()=>goto('/game')}>Play</button>
</main>