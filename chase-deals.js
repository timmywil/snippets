// A bookmarklet for adding all Chase deals
// First minify with `npx minify chase-deals.js`
javascript: (function () {
  const goBack = () => {
    window.history.back()
    setTimeout(add, Math.random() * 500 + 300)
  }
  const add = () => {
    const btn = document.querySelector('[data-cy="commerce-tile-button"]')
    if (!btn) return console.log('added all!')
    btn.click()
    setTimeout(goBack, Math.random() * 500 + 300)
  }
  add()
})()
