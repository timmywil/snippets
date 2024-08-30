/**
 * A JS implementation of Dijkstra's Algorithm
 * for finding the shortest path in a weighted graph
 */
import assert from 'node:assert'
import { MinHeap } from './heap.js'

// Get the shortest path to all nodes
function shortestPath(graph, a, b) {
    function getNeighbors(node) {
        return graph[node]
    }

    function bfs(root, target) {
        const queue = new MinHeap()
        const distances = []

        // Fills the queue with all nodes
        for (let i = 0; i < graph.length; i++) {
            if (i === root) {
                distances.push(0)
                queue.push(i, 0)
            } else {
                distances.push(Number.MAX_VALUE)
                queue.push(i, Number.MAX_VALUE)
            }
        }

        while (queue.size) {
            const node = queue.pop()
            for (const [neighbor, weight] of getNeighbors(node)) {
                const distance = distances[node] + weight
                if (distances[neighbor] <= distance) continue
                queue.push(neighbor, distance)
                distances[neighbor] = distance
            }
        }
        return distances[target]
    }

    const result = bfs(a, b)
    return result === Number.MAX_VALUE ? -1 : result
}

// Get the shortest path to the target
// and return early
function uniformCostSearch(graph, a, b) {
    function getNeighbors(node) {
        return graph[node]
    }

    function bfs(root, target) {
        const queue = new MinHeap()
        // The queue only gets filled with nodes
        // from the path of the source node.
        queue.push(root, 0)
        const distances = Array(graph.length).fill(Number.MAX_VALUE)
        distances[root] = 0

        while (queue.size) {
            const n = queue.popNode()
            const [node, distance] = [n.value, n.priority]
            if (node === target) return distance

            for (const [neighbor, weight] of getNeighbors(node)) {
                const d = distances[node] + weight
                if (distances[neighbor] <= d) continue
                queue.push(neighbor, d)
                distances[neighbor] = d
            }
        }
        return distances[target]
    }

    const result = bfs(a, b)
    return result === Number.MAX_VALUE ? -1 : result
}

assert.deepStrictEqual(
    shortestPath(
        [
            [
                [1, 1],
                [2, 1]
            ],
            [
                [0, 1],
                [2, 1],
                [3, 1]
            ],
            [
                [0, 1],
                [1, 1]
            ],
            [[1, 1]]
        ],
        0,
        3
    ),
    2
)

assert.deepStrictEqual(
    shortestPath(
        [
            [
                [1, 1],
                [2, 2]
            ],
            [
                [0, 1],
                [2, 0],
                [3, 3]
            ],
            [
                [0, 2],
                [1, 0],
                [3, 1]
            ],
            [
                [1, 3],
                [2, 1]
            ]
        ],
        0,
        3
    ),
    2
)

assert.deepStrictEqual(
    uniformCostSearch(
        [
            [
                [1, 1],
                [2, 1]
            ],
            [
                [0, 1],
                [2, 1],
                [3, 1]
            ],
            [
                [0, 1],
                [1, 1]
            ],
            [[1, 1]]
        ],
        0,
        3
    ),
    2
)

assert.deepStrictEqual(
    uniformCostSearch(
        [
            [
                [1, 1],
                [2, 2]
            ],
            [
                [0, 1],
                [2, 0],
                [3, 3]
            ],
            [
                [0, 2],
                [1, 0],
                [3, 1]
            ],
            [
                [1, 3],
                [2, 1]
            ]
        ],
        0,
        3
    ),
    2
)

console.log('Tests passed')
