const toggleBtn = document.querySelector('.toggle-btn')
const navbarLinks = document.querySelector('.navbar-links')

toggleBtn.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})




const closeBtn = document.querySelector('.close')
const flashMessage = document.querySelector('.flash-message')

closeBtn.addEventListener('click', () => {
    flashMessage.classList.toggle('active')
})