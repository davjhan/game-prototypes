export function position(node: HTMLElement, props: { x: number, y: number, row: number, col: number, cellSize: number }) {

	function doPosition(props) {
		if (props.x !== undefined || props.y !== undefined) {
			props.x = props.x ?? 0
			props.y = props.y ?? 0
			node.style.transform = `translate3d(${ props.x }px, ${ props.y }px, 0)`
		} else if (props.cellSize !== undefined && (props.col !== undefined || props.row !== undefined)) {
			props.col = props.col ?? 0
			props.row = props.row ?? 0
			node.style.transform = `translate3d(${ props.col * props.cellSize }px, ${ props.row * props.cellSize }px, 0)`
		}
	}

	doPosition(props)
	return {
		update(props) {
			doPosition(props)
		}
	}
}