import assert from 'node:assert'

const moves = [
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
    [-2, 1],
    [-1, 2],
    [1, 2],
    [2, 1]
]
function getMoves(x, y) {
    return moves.map(([a, b]) => [x + a, y + b])
}
function getKnightShortestPath(x, y) {
    const queue = [[0, 0]]
    const visited = new Set(['0,0'])
    let path = 0
    let len

    while ((len = queue.length)) {
        for (let i = 0; i < len; i++) {
            const [row, col] = queue.shift()
            if (row === x && col === y) return path

            for (const move of getMoves(row, col)) {
                const key = move.join(',')
                if (!visited.has(key)) {
                    queue.push(move)
                    // At this point we know another path
                    // reached this position sooner,
                    // so we don't need to continue
                    visited.add(key)
                }
            }
        }

        path++
    }

    return path
}

assert.deepStrictEqual(getKnightShortestPath(2, 1), 1)
assert.deepStrictEqual(getKnightShortestPath(5, 5), 4)
assert.deepStrictEqual(getKnightShortestPath(1, 1), 2)

console.log('Tests passed')
