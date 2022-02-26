/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
import { StartStopNotifier, Unsubscriber } from 'svelte/store'

export type EventBus = {
	dispatch<T, R>(channel: string, e?: T): R
	subscribe<T, R>(channel: String, subscriber: Listener<T, R>): Unsubscriber
}
export type Listener<T, R = void> = (value: T) => R;

export function eventBus(): EventBus {
	const channels: Map<string, Set<Listener<any, any>>> = new Map()

	function dispatch<T, R>(channel: string, e?: T): R {

		const subscribers = channels.get(channel)
		if (!subscribers) return
		for (let it of subscribers) {
			const result = it(e)
			if (result) return result
		}
		return
	}

	function subscribe<T, R>(channel: string, subscriber: Listener<T, R>): Unsubscriber {
		if (!channels.has(channel)) channels.set(channel, new Set())
		const subscribers = channels.get(channel)
		subscribers.add(subscriber)
		return () => {
			subscribers.delete(subscriber)
		}
	}

	return { dispatch, subscribe }
}