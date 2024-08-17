import assert from 'node:assert'
import { test } from 'node:test'
import { MinHeap } from '../heap.js'

test('MinHeap', () => {
    const heap = new MinHeap()
    heap.push(4)
    heap.push(2)
    heap.push(3)
    heap.push(1)

    assert.deepStrictEqual(heap.size, 4)
    assert.deepStrictEqual(heap.peak(), 1)
    assert.deepStrictEqual(heap.pop(), 1)
    assert.deepStrictEqual(heap.pop(), 2)
    assert.deepStrictEqual(heap.pop(), 3)

    heap.push(17)
    heap.push(2)
    assert.deepStrictEqual(heap.pop(), 2)
    assert.deepStrictEqual(heap.pop(), 4)
    assert.deepStrictEqual(heap.pop(), 17)
    assert.deepStrictEqual(heap.pop(), undefined)
})

test('heapTop3', () => {
    function heapTop3(arr) {
        const heap = new MinHeap()
        for (const x of arr) {
            heap.push(x)
        }
        const res = []
        for (let i = 0; i < 3; i++) {
            res.push(heap.pop())
        }
        return res
    }

    assert.deepStrictEqual(heapTop3([3, 1, 2, 10, 33, 100, 20]), [1, 2, 3])
})
