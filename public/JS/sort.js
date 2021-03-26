const sortBtn = document.querySelector('#sort-btn')
const select = document.querySelector('#sort')
sortBtn.addEventListener('click', () => {
    window.location.href = `/resource${select.value}`
})