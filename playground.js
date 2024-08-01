function subsets(nums) {
  const res = []
  function dfs(i, cur) {
    if (i == nums.length) {
      res.push([...cur])
      return
    }
    cur.push(nums[i])
    dfs(i + 1, cur)
    cur.pop()
    dfs(i + 1, cur)
  }
  dfs(0, [])
  return res
}

console.log(JSON.stringify(subsets([1, 2, 3])))
