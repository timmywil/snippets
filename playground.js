import assert from 'node:assert'
import { MinHeap } from './heap.js'

function findInDegree(graph) {
    const indegree = new Map()
    for (const node of graph.keys()) {
        indegree.set(node, 0)
    }
    for (const node of graph.keys()) {
        for (const neighbor of graph.get(node)) {
            indegree.set(neighbor, indegree.get(neighbor) + 1)
        }
    }
    return indegree
}

function topoSort(graph) {
    const result = []

    // Part of this problem is returning
    // the English-sorted result if there
    // are multiple possible answers.
    // We use a heap to avoid having
    // to sort the whole queue.
    const heap = new MinHeap()
    const indegree = findInDegree(graph)

    for (const node of indegree.keys()) {
        if (indegree.get(node) === 0) {
            heap.push(node)
        }
    }

    while (heap.size) {
        const node = heap.pop()
        result.push(node)

        for (const neighbor of graph.get(node)) {
            indegree.set(neighbor, indegree.get(neighbor) - 1)

            if (indegree.get(neighbor) === 0) {
                heap.push(neighbor)
            }
        }
    }
    return result.length === graph.size ? result : []
}

function alienOrder(words) {
    const graph = new Map()
    for (const word of words) {
        for (const letter of word) {
            if (!graph.has(letter)) {
                // Use a set to avoid duplicates
                graph.set(letter, new Set())
            }
        }
    }

    // Because the list of words is sorted
    // lexographically, we only need to
    // check the adjacent word.
    // Words prior to that already differ
    // more than the adjacent word.
    let prev = words[0]
    for (const word of words.slice(1)) {
        for (let i = 0; i < word.length && i < prev.length; i++) {
            if (prev[i] !== word[i]) {
                graph.get(prev[i]).add(word[i])
                break
            }
        }
        prev = word
    }

    return topoSort(graph).join('')
}

assert.deepStrictEqual(alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt']), 'wertf')
assert.deepStrictEqual(
    alienOrder(['she', 'sell', 'seashell', 'seashore', 'seahorse', 'on', 'a']),
    'lnrsheoa'
)

console.log('Tests passed')
