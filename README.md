# ;paradigma — site estático

Site responsivo criado com HTML, Tailwind CSS (via CDN) e JavaScript simples.

## Estrutura de pastas (resumida)

```
/
├── index.html
├── manifesto.html
├── conteudos.html
├── sobre.html
├── contato.html
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── img/
    │   ├── hero-overlay.svg
    │   └── favicon.svg
    └── data/
        └── conteudos.json
```

## Como editar a Home (`index.html`)

A página inicial foi reorganizada em blocos independentes. Os textos podem ser alterados diretamente no HTML.

### Hero (primeira dobra)
- Headline e subheadline ficam nos elementos `<h1>` e `<p>` logo após o rótulo “Biologia evolutiva na prática”.
- Para trocar a imagem de fundo, atualize o `src` do `<img>` dentro da primeira `<section>`.
- Os botões “Assinar newsletter” e “Explorar conteúdos” utilizam o atributo `data-scroll-target` para rolar até as seções correspondentes. Caso altere os IDs das seções, ajuste também o atributo nos links.

### Manifesto condensado
- Altere os parágrafos dentro da seção identificada por `aria-labelledby="manifesto-heading"`.
- O botão “Ler manifesto completo” aponta para `manifesto.html`. Atualize o `href` caso o arquivo mude de local.

### Conteúdos em destaque
- Os cards são gerados dinamicamente a partir do arquivo `assets/data/conteudos.json`.
- Cada item do array deve conter os campos obrigatórios:
  - `titulo` — texto curto em formato de string.
  - `descricao` — resumo provocativo com até 1 ou 2 frases.
  - `imagem` — URL completa (ex.: `https://placehold.co/600x400`) ou caminho relativo dentro de `assets/img/`.
  - `link` — destino do botão “Ler mais” (página interna ou externa).
- Opcionalmente, inclua `alt` para personalizar o texto alternativo da imagem.
- Para adicionar ou editar conteúdos:
  1. Abra `assets/data/conteudos.json` em um editor de texto.
  2. Duplique um dos objetos existentes (cada objeto é separado por vírgulas) e ajuste os campos.
  3. Salve o arquivo e recarregue o `index.html` no navegador para visualizar as mudanças.
- Se o JSON estiver vazio, malformatado ou indisponível, a Home usa automaticamente três cards padrão definidos no script inline do `index.html`. Uma mensagem informativa aparece abaixo dos cards indicando se os dados vieram do arquivo ou do fallback.

### Bloco interativo/reflexão
- Os botões possuem atributos `data-reflexao` (`cacar`, `cooperar`, `fugir`).
- Para alterar as respostas, edite o objeto `reflexoes` no script inline no final da página, mantendo a correspondência com os valores de `data-reflexao`.

### Newsletter / Comunidade
- A seção verde possui o ID `newsletter` e utiliza o mesmo endpoint placeholder do MailerLite (`https://app.mailerlite.com/webforms/submit/placeholder`).
- Substitua o valor de `action` pelos dados do formulário real e, se necessário, acrescente campos ocultos exigidos pelo MailerLite.
- O formulário do card “Radar evolutivo” no Hero compartilha a mesma URL de envio.

### Materiais / Infoprodutos
- O título, parágrafo e botão ficam dentro da seção identificada por `infoproduto-heading`.
- O bloco da direita usa a imagem `hero-overlay.svg` como textura. Troque a classe `bg-[url('...')]` para apontar outra arte ou substitua por um `<img>` convencional.

### Frase de fecho e rodapé
- Atualize o texto destacado dentro da seção `aria-label="Mensagem final"` conforme necessário.
- Os links do rodapé e ícones sociais estão agrupados no `<footer>`. Substitua as URLs pelos perfis oficiais da marca.

## Imagens e fontes

- Substitua arquivos em `assets/img/` mantendo os nomes ou atualize os caminhos diretamente no HTML/JSON.
- As fontes **Poppins** e **League Gothic** são importadas via Google Fonts no `<head>` do `index.html`. Ajuste o `<link>` caso prefira servir arquivos locais.

## Scripts

- `assets/js/main.js` controla o menu mobile.
- O script inline no final de `index.html` é responsável pela rolagem suave, bloco interativo e carregamento dos conteúdos em destaque.

## Visualizar localmente

Abra qualquer arquivo `.html` diretamente no navegador. Não há build ou servidor necessários.
