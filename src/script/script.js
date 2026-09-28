const menuIcone = document.getElementById("menu-icone");
const navMenu = document.getElementById("nav-menu");
 
menuIcone.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuIcone.classList.toggle("open");
});
 
// FECHA O MENU AO CLICAR EM UM LINK (útil no mobile)
const links = document.querySelectorAll("#nav-menu a");
links.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuIcone.classList.remove("open");
    });
});