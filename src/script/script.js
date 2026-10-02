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

const slides = document.querySelectorAll(".capa-slide");
let atual = 0;
 
setInterval(() => {
    slides[atual].classList.remove("on");
    atual = (atual + 1) % slides.length;
    slides[atual].classList.add("on");
}, 3500);
 
// Faíscas que sobem balançando (desligado se a pessoa pediu menos movimento)
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

// ===== LOJINHA =====
const KUNAI = "./src/assets/Kunai-Sc.jpg";
const TOLERANCIA = 45;   // quanto maior, mais cores parecidas com o fundo somem
 
const carrinho = document.getElementById("carrinho");
const qtdLoja = document.getElementById("carrinho-qtd");
const painel = document.getElementById("loja-painel");
const fundoLoja = document.getElementById("loja-fundo");
const lista = document.getElementById("loja-lista");
const vazia = document.getElementById("loja-vazia");
const totalEl = document.getElementById("loja-total");
 
let itens = [];
let proximoId = 1;
let ocupado = false;
 
const suavizar = (t) => 1 - Math.pow(1 - t, 3);
const moeda = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
 
// Remove o fundo de uma imagem de verdade: descobre a cor do fundo pelos cantos
// e apaga só o que está ligado às bordas (o miolo da kunai não fica furado).
const cacheSemFundo = {};
function semFundo(src) {
    if (!cacheSemFundo[src]) {
        cacheSemFundo[src] = new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const w = img.naturalWidth, h = img.naturalHeight;
                    const c = document.createElement("canvas");
                    c.width = w;
                    c.height = h;
                    const x = c.getContext("2d", { willReadFrequently: true });
                    x.drawImage(img, 0, 0);
                    const dados = x.getImageData(0, 0, w, h);
                    const p = dados.data;
 
                    // cor do fundo = média dos 4 cantos
                    let r = 0, g = 0, b = 0;
                    [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]].forEach(([cx, cy]) => {
                        const i = (cy * w + cx) * 4;
                        r += p[i]; g += p[i + 1]; b += p[i + 2];
                    });
                    r /= 4; g /= 4; b /= 4;
 
                    const parecido = (pos) =>
                        Math.hypot(p[pos] - r, p[pos + 1] - g, p[pos + 2] - b) < TOLERANCIA;
 
                    // preenchimento a partir das bordas
                    const visto = new Uint8Array(w * h);
                    const pilha = [];
                    const semear = (px, py) => {
                        const k = py * w + px;
                        if (!visto[k] && parecido(k * 4)) {
                            visto[k] = 1;
                            pilha.push(k);
                        }
                    };
                    for (let i = 0; i < w; i++) { semear(i, 0); semear(i, h - 1); }
                    for (let j = 0; j < h; j++) { semear(0, j); semear(w - 1, j); }
 
                    while (pilha.length) {
                        const k = pilha.pop();
                        const px = k % w, py = (k - px) / w;
                        if (px > 0) semear(px - 1, py);
                        if (px < w - 1) semear(px + 1, py);
                        if (py > 0) semear(px, py - 1);
                        if (py < h - 1) semear(px, py + 1);
                    }
 
                    for (let k = 0; k < visto.length; k++) {
                        if (visto[k]) p[k * 4 + 3] = 0;
                    }
 
                    // suaviza a borda: pixel de objeto encostado no fundo fica meio transparente
                    const copia = new Uint8Array(visto);
                    for (let py = 1; py < h - 1; py++) {
                        for (let px = 1; px < w - 1; px++) {
                            const k = py * w + px;
                            if (copia[k]) continue;
                            if (copia[k - 1] || copia[k + 1] || copia[k - w] || copia[k + w]) {
                                p[k * 4 + 3] = 150;
                            }
                        }
                    }
 
                    x.putImageData(dados, 0, 0);
                    resolve(c.toDataURL("image/png"));
                } catch (e) {
                    resolve(src);   // se o navegador bloquear o canvas, usa a imagem original
                }
            };
            img.onerror = () => resolve(src);
            img.src = src;
        });
    }
    return cacheSemFundo[src];
}
semFundo(KUNAI);   // já deixa a kunai pronta
 
// ----- painel da loja -----
function abrirPainel() {
    painel.classList.add("aberto");
    fundoLoja.classList.add("aberto");
    painel.setAttribute("aria-hidden", "false");
}
 
function fecharPainel() {
    painel.classList.remove("aberto");
    fundoLoja.classList.remove("aberto");
    painel.setAttribute("aria-hidden", "true");
}
 
carrinho.addEventListener("click", () => {
    painel.classList.contains("aberto") ? fecharPainel() : abrirPainel();
});
document.getElementById("loja-fechar").addEventListener("click", fecharPainel);
fundoLoja.addEventListener("click", fecharPainel);
addEventListener("keydown", (e) => { if (e.key === "Escape") fecharPainel(); });
 
document.getElementById("loja-limpar").addEventListener("click", () => {
    itens = [];
    renderizar();
});
 
function renderizar() {
    lista.innerHTML = "";
 
    itens.forEach((item) => {
        const li = document.createElement("li");
        li.className = "loja-item";
 
        const foto = document.createElement("img");
        foto.src = item.src;
        foto.alt = "";
 
        const info = document.createElement("div");
        info.className = "loja-info";
        const nome = document.createElement("strong");
        nome.textContent = item.nome;
        const preco = document.createElement("span");
        preco.textContent = moeda(item.preco);
        info.append(nome, preco);
 
        const cancelar = document.createElement("button");
        cancelar.type = "button";
        cancelar.className = "loja-cancelar";
        cancelar.textContent = "Cancelar";
        cancelar.addEventListener("click", () => {
            itens = itens.filter((i) => i.id !== item.id);
            renderizar();
        });
 
        li.append(foto, info, cancelar);
        lista.appendChild(li);
    });
 
    vazia.classList.toggle("oculta", itens.length > 0);
    qtdLoja.textContent = itens.length;
    totalEl.textContent = moeda(itens.reduce((soma, i) => soma + i.preco, 0));
}
 
function adicionar(produto) {
    itens.push(produto);
    renderizar();
    carrinho.classList.remove("balanca");
    void carrinho.offsetWidth;            // reinicia a animação
    carrinho.classList.add("balanca");
}
renderizar();
 
// ----- kunai puxando o produto -----
function medir(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
}
 
async function puxarProduto(card) {
    if (ocupado) return;
    ocupado = true;
 
    const img = card.querySelector(".card-img");
    const produto = {
        id: proximoId++,
        nome: card.querySelector(".card-titulo").textContent,
        preco: parseFloat(card.querySelector(".card-preco").textContent.replace(/[^\d,]/g, "").replace(",", ".")),
        src: img.src
    };
 
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        adicionar(produto);
        ocupado = false;
        return;
    }
 
    const [srcKunai, srcProduto] = await Promise.all([
        semFundo(KUNAI),
        semFundo(img.src)
    ]);
 
    const A = medir(carrinho);            // onde a corrente fica presa
    const T = medir(img);                 // onde a kunai vai cravar
    const dist = Math.hypot(T.x - A.x, T.y - A.y);
    const ang = Math.atan2(T.y - A.y, T.x - A.x);
 
    const gancho = document.createElement("div");
    gancho.className = "gancho";
    gancho.style.left = A.x + "px";
    gancho.style.top = A.y + "px";
    gancho.style.transform = `rotate(${ang}rad)`;
    gancho.innerHTML = `<div class="corrente"></div><img class="kunai-voo" src="${srcKunai}" alt="">`;
 
    const voo = document.createElement("img");   // cópia do produto (sem fundo) que vai ser arrastada
    voo.className = "produto-voo";
    voo.src = srcProduto;
    voo.alt = "";
    voo.style.visibility = "hidden";
 
    document.body.append(gancho, voo);
 
    const IDA = 350, PAUSA = 120, VOLTA = 600;
    const inicio = performance.now();
 
    function quadro(agora) {
        const t = agora - inicio;
        let comp, escala = 1;
 
        if (t < IDA) {
            comp = dist * suavizar(t / IDA);
        } else if (t < IDA + PAUSA) {
            comp = dist;
        } else {
            const p = Math.min(1, (t - IDA - PAUSA) / VOLTA);
            comp = dist * (1 - suavizar(p));
            escala = 1 - 0.8 * suavizar(p);
        }
 
        gancho.style.width = comp + "px";
 
        if (t >= IDA) {                   // depois de cravar, o produto acompanha a ponta
            const w = T.w * escala, h = T.h * escala;
            voo.style.visibility = "visible";
            voo.style.width = w + "px";
            voo.style.height = h + "px";
            voo.style.left = A.x + Math.cos(ang) * comp - w / 2 + "px";
            voo.style.top = A.y + Math.sin(ang) * comp - h / 2 + "px";
        }
 
        if (t < IDA + PAUSA + VOLTA) {
            requestAnimationFrame(quadro);
        } else {
            gancho.remove();
            voo.remove();
            adicionar(produto);
            ocupado = false;
        }
    }
    requestAnimationFrame(quadro);
}
 
document.querySelectorAll(".btn-comprar").forEach((btn) => {
    btn.addEventListener("click", () => puxarProduto(btn.closest(".card")));
});