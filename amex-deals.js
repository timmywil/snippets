// A bookmarklet for adding all AMEX deals
// First minify with `npx minify amex-deals.js`
javascript: (function () {
  const btns = [...document.querySelectorAll('.offer-cta')].filter(
    (b) => b.textContent === 'Add to Card'
  )
  const add = () => {
    const b = btns.pop()
    if (!b) return console.log('added all!')
    b.click()
    setTimeout(add, Math.random() * 1000 + 300)
  }
  add()
})()
