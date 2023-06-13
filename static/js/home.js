window.onload = () => {
    const MenuClick = document.querySelector(".nav-bar__icon");
    MenuClick.addEventListener('click', () => {
        const navMenu = document.querySelector(".nav-bar");
        const classVisible = 'nav-bar__link_visible';
        if (navMenu.classList.contains(classVisible)) {
            navMenu.classList.remove(classVisible);
        } else {
            navMenu.classList.add(classVisible);
        }
    });
}