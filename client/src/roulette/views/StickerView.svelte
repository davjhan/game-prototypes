<script lang="ts">
    import { Sticker } from '../sticker'

    export let sticker:Sticker
</script>


<circle r={sticker.shape.r} fill={sticker.color}
        stroke='black'
        stroke-width='2'
        >
</circle>