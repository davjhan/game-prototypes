import { BlockType } from '$bagger/blocks'
import { traceLayout } from '$bagger/graphics/layoutTracer'

/* Convenience methods to generate SVG defs. */
const cornerRadius = 4

// language=HTML
export const stripes = (id: string, fill: string) => `
    <pattern id='${ id }'
             patternUnits='userSpaceOnUse'
             width='0.4'
             height='1'
             patternTransform='rotate(45)'
             fill='red'
    >

            <animate attributeName="x" values="0;2" dur="3s" repeatCount="indefinite" />
        <line x1='' x2='0' y2='2' stroke='${ fill }' stroke-width='0.5' />
    </pattern>
`

// language=HTML
export const block = (item: BlockType, cellSize: number) => `
    <svg width='${ item.layout[0].length * cellSize }' height='${ item.layout.length * cellSize }' 
         class='pointer-events-none'
         overflow='visible'
         viewBox='0 0 ${ item.layout[0].length }  ${ item.layout.length }'
    >
            ${ stripes('placement-stripes-error', '#f87171')}
        ${ path(traceLayout(item, cornerRadius / cellSize)) }
    </svg>
`


// language=HTML
export const path = (path: string) => `
    <path class='pointer-events-auto' d='${ path }' vector-effect='non-scaling-stroke'></path>
`