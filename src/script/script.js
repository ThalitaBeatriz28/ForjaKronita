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

const fogo = document.getElementById("fogo");
 
for (let k = 0; k < 11; k++) {
    const chama = document.createElement("i");
    const largura = 14 + Math.random() * 16;
    chama.style.cssText = `
        left: ${k * 9.5 - 2}%;
        width: ${largura}%;
        height: ${110 + Math.random() * 90}px;
        animation-delay: ${-Math.random() * 1.5}s;
        animation-duration: ${1.1 + Math.random() * 1}s;
    `;
    fogo.appendChild(chama);
}
 
// 2) brasas: faíscas que sobem balançando (desligado se a pessoa pediu menos movimento)
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const canvas = document.getElementById("brasas");
    const ctx = canvas.getContext("2d");
    let largura, altura;
    const brasas = [];
 
    function ajustarTamanho() {
        largura = canvas.width = canvas.offsetWidth;
        altura = canvas.height = canvas.offsetHeight;
    }
    ajustarTamanho();
    addEventListener("resize", ajustarTamanho);
 
    function novaBrasa() {
        return {
            x: Math.random() * largura,
            y: altura + 10,
            raio: 0.6 + Math.random() * 2.2,
            velocidade: 0.5 + Math.random() * 1.6,
            fase: Math.random() * 6
        };
    }
 
    for (let k = 0; k < 70; k++) {
        const b = novaBrasa();
        b.y = Math.random() * altura;
        brasas.push(b);
    }
 
    function animar() {
        ctx.clearRect(0, 0, largura, altura);
 
        brasas.forEach((b, i) => {
            b.y -= b.velocidade;
            b.fase += 0.04;
            b.x += Math.sin(b.fase) * 0.7;
            const brilho = Math.max(0, (b.y / altura) * (0.6 + 0.4 * Math.sin(b.fase * 3)));
 
            if (b.y < 0 || brilho <= 0.02) {
                brasas[i] = novaBrasa();
                return;
            }
 
            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.raio * 4);
            g.addColorStop(0, `rgba(255, ${170 + b.raio * 20}, 60, ${brilho})`);
            g.addColorStop(1, "rgba(255, 60, 20, 0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.raio * 4, 0, Math.PI * 2);
            ctx.fill();
        });
 
        requestAnimationFrame(animar);
    }
    animar();
}
 