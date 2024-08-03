// A bookmarklet for adding all Chase deals
// First minify with `npx uglify-js chase-deals.js`
// I'd normally use swc, but it requires installing deps first
javascript: (function () {
    const goBack = () => {
        window.history.back()
        setTimeout(add, Math.random() * 500 + 300)
    }
    const add = () => {
        const btns = [...document.querySelectorAll('[data-cy="commerce-tile-button"]')]
        const btn = btns.pop()
        if (!btn) return console.log('added all!')
        btn.click()
        setTimeout(goBack, Math.random() * 500 + 300)
    }
    add()
})()
