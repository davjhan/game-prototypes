import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

export function lockscroll(node) {
	disableBodyScroll(node)
	return {
		destroy() {
			enableBodyScroll(node)
		}
	}
}