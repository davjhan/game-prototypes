import { Layouts } from '$bagger/grids'

describe('Trim End', () => {
	it('Simple', () => {
		const result = Layouts.toGrid([
			{
				col: 0,
				row: 0,
				layout: [
					[1]
				],
			}
		], 10, 10)
		expect(result.trimEnd().mapEachCell(it => it.value ?? 0)).toStrictEqual([[1]])
	})
	it('Gapped', () => {
		const layout = [
			[1, 1, 1],
			[1, 0, 1],
			[0, 1, 0],
		]
		const result = Layouts.toGrid([
			{
				col: 0,
				row: 0,
				layout,
			}
		], 10, 10)

		expect(result.trimEnd().mapEachCell(it => it.value ?? 0)).toStrictEqual(layout)
	})
})

describe('Merge Layouts', () => {
	it('simple', () => {
		const result = Layouts.combine([
			{

				col: 20,
				row: 20,
				layout: [
					[1, 1],
					[0, 1],
				]
			},
			{
				col: 20,

				row: 21,
				layout: [
					[1, 0],
					[1, 1],
				]
			}
		])
		expect(result).toStrictEqual({
			col: 20,
			row: 20,
			layout: [
				[1, 1],
				[1, 1],
				[1, 1],
			]
		})
	})
})