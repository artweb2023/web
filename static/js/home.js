window.onload = () => {
    const MenuClick = document.querySelector(".nav-bar__icon");
    MenuClick.addEventListener('click', () => {
        const navMenu = document.querySelector(".nav-bar");
        const className = 'nav-bar__link_visible';
        if (navMenu.classList.contains(className)) {
            navMenu.classList.remove(className);
        } else {
            navMenu.classList.add(className);
        }
    });
}