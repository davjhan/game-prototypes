export type DragEvent = {
	detail: {
		type: string
		x: number,
		y: number,
	}
}
const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent =>
	!!(event as TouchEvent).touches?.length

export function drag(node: HTMLElement,) {
	let active = false
	/* disable highlighting words on drag */
	const originalBodyStyle = document.body.style.userSelect
	// On mobile, touch can become extremely janky without it
	node.style.touchAction = 'none'

	function dragStart(e: TouchEvent | MouseEvent) {
		const { clientX, clientY } = isTouchEvent(e) ? e.touches[0] : e
		active = true
		addEventListener('mousemove', dragging)
		addEventListener('touchmove', dragging)
		addEventListener('mouseup', dragEnd)
		addEventListener('touchend', dragEnd)
		node.dispatchEvent(new CustomEvent('drag-start', {
			detail: {
				type: e.type,
				x: clientX,
				y: clientY,
			}
		}))
		document.body.style.userSelect = 'none'
		e.preventDefault()
	}

	function dragging(e: TouchEvent | MouseEvent) {
		/* ignore multitouch */
		if (e.type === 'touchstart' && (e as TouchEvent).touches.length > 1) return
		const { clientX, clientY } = isTouchEvent(e) ? e.touches[0] : e

		if (!active) return

		node.dispatchEvent(new CustomEvent('dragging', {
			detail: {
				type: e.type,
				x: clientX,
				y: clientY,
			}
		}))
	}

	function dragEnd(e: TouchEvent | MouseEvent) {
		removeEventListener('mousemove', dragging)
		removeEventListener('touchmove', dragging)
		removeEventListener('mouseup', dragEnd)
		removeEventListener('touchend', dragEnd)
		const { clientX, clientY } = isTouchEvent(e) ? e.touches[0] : e
		if (!active) return
		active = false
		node.dispatchEvent(new CustomEvent('drag-end', {
			detail: {
				type: e.type,
				x: clientX,
				y: clientY,
			}
		}))
		document.body.style.userSelect = originalBodyStyle
	}

	node.addEventListener('mousedown', dragStart)
	node.addEventListener('touchstart', dragStart)


	return {
		destroy() {
			node.removeEventListener('mousedown', dragStart)
			node.removeEventListener('touchstart', dragStart)
			removeEventListener('mousemove', dragging)
			removeEventListener('touchmove', dragging)
			removeEventListener('mouseup', dragEnd)
			removeEventListener('touchend', dragEnd)
		}
	}
}