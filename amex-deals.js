// A bookmarklet for adding all AMEX deals
// First minify with `npx uglify-js amex-deals.js`
// I'd normally use swc, but it requires installing deps first
javascript: (function () {
    const btns = [...document.querySelectorAll('button[title="Add to Card"]')]
    const add = () => {
        const btn = btns.pop()
        if (!btn) return console.log('added all!')
        btn.click()
        setTimeout(add, Math.random() * 1000 + 300)
    }
    add()
})()
