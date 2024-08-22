class HeapNode {
    constructor(value, priority) {
        this.priority = priority ?? value
        this.value = value
    }
}

export class MinHeap {
    constructor() {
        this.heap = []
    }
    push(value, priority) {
        const node = new HeapNode(value, priority)
        const heap = this.heap

        // Place at the end, then bubble up
        // until it's in the right place
        heap.push(node)

        let index = this.size - 1
        let parentIndex = Math.floor((index - 1) / 2)
        while (parentIndex >= 0 && heap[index].priority < heap[parentIndex].priority) {
            ;[heap[parentIndex], heap[index]] = [heap[index], heap[parentIndex]]
            index = parentIndex
            parentIndex = Math.floor((index - 1) / 2)
        }
    }
    popNode() {
        if (!this.size) return
        const heap = this.heap

        // Swap first and last element
        ;[heap[0], heap[this.size - 1]] = [heap[this.size - 1], heap[0]]

        const node = heap.pop()

        // Bubble down until the last element is in a place that fits
        const len = this.size
        let index = 0
        let min = index

        while (index < len) {
            const left = index * 2 + 1
            const right = left + 1

            // Swap with the lesser child,
            // which should only matter at the beginning
            // to ensure the smallest node makes it to the top
            if (left < len && heap[min].priority > heap[left].priority) {
                min = left
            }
            if (right < len && heap[min].priority > heap[right].priority) {
                min = right
            }
            if (index === min) break
            ;[heap[index], heap[min]] = [heap[min], heap[index]]
            index = min
        }

        return node
    }
    pop() {
        return this.popNode()?.value
    }
    peak() {
        return this.heap[0]?.value
    }
    get size() {
        return this.heap.length
    }
}
