# ⚒️ ForjaKronita

> *Forjado em fogo, selado em sombras.*

Landing page de uma loja fictícia de colecionáveis temáticos inspirados no universo Mortal Kombat. O projeto mostra uma vitrine de produtos, um carrinho animado e um visual com fogo, brasas e tons de bronze e ouro.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Canvas](https://img.shields.io/badge/Canvas%20API-FF6F00?style=for-the-badge)

---

## 📌 Sobre o projeto

- **Tipo:** site estático de página única (*single page*)
- **Stack:** HTML5, CSS3 e JavaScript puro, sem frameworks, sem dependências de pacotes e sem etapa de build
- **Idioma:** português (pt-BR)

---

## 🗂️ Estrutura

```
ForjaKronita-main/
├── index.html                  # Estrutura da página, produtos, sobre e contato
└── src/
    ├── assets/                 # Imagens: fotos da capa, produtos, logo e kunai
    ├── css/
    │   └── style.css           # Estilos, tema e animações
    └── script/
        └── script.js           # Menu, capa, brasas, carrinho e animação da kunai
```
---

## 🚀 Como executar

Como o site não tem dependências, basta uma cópia local dos arquivos.

Acesse o site https://thalitabeatriz28.github.io/ForjaKronita/

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---|---|
| 🔥 **Capa animada** | Slides de fotos com troca automática a cada 3,5 segundos, chamas CSS e brasas em canvas |
| 🛒 **Carrinho** | Painel lateral com lista de itens, total em R$ e opções para cancelar um item ou limpar tudo |
| 🪝 **Kunai animada** | Ao clicar em *Comprar*, uma kunai com corrente voa até o carrinho e puxa o produto |
| ✂️ **Remoção de fundo** | As imagens dos produtos têm o fundo apagado via Canvas, por preenchimento a partir das bordas |
| 📱 **Menu responsivo** | Menu hambúrguer em telas pequenas, com fechamento ao clicar em um link |
| ♿ **Movimento reduzido** | Brasas e animações são desativadas para quem usa `prefers-reduced-motion` |

## ♿ Acessibilidade

- Imagens dos produtos têm texto alternativo com o nome do item.
- Botão do carrinho tem `aria-label` e o painel tem `aria-hidden` atualizado a cada abertura.
- Fecha com a tecla `Esc`.
- Respeita `prefers-reduced-motion`.

---

### 🌑 Forjado nas sombras com os melhores equipamentos ⚒️
