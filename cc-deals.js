// A bookmarklet for adding all AMEX, Chase, and Wells Fargo deals.
// Minify with `npx uglify-js cc-deals.js` and use `pbcopy` or `clip` to copy to clipboard.
// I'd normally use swc, but it requires installing deps first.
javascript: (function () {
    function randomDelay() {
        return Math.random() * 500 + 750
    }
    const btns = [
        ...document.querySelectorAll('button[title="Add to Card"]'), // AMEX
        ...document.querySelectorAll('[data-testid="deal-tile"]') // Wells Fargo
    ]
    function goBack() {
        window.history.back()
        setTimeout(add, randomDelay())
    }
    function closeModal() {
        const modalClose = document.querySelector('[data-testid="modal-lightbox-close-icon"]')
        if (modalClose) {
            modalClose.click()
            return setTimeout(add, randomDelay())
        }
        add()
    }
    function add() {
        // Chase requires going to a new page
        // Activate chase deals in reverse order
        const chase = [...document.querySelectorAll('[data-cy="commerce-tile-button"]')].pop()
        if (chase) {
            chase.click()
            return setTimeout(goBack, randomDelay())
        }
        const btn = btns.pop()
        if (!btn) return console.log('All offers added!')
        btn.click()
        setTimeout(closeModal, randomDelay())
    }
    add()
})()
