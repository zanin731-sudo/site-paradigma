# ;paradigma — site estático

Site estático responsivo criado com HTML, Tailwind CSS (via CDN) e JavaScript simples.

## Estrutura

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
    └── fonts/
```

## Edição de textos e imagens

Todos os trechos editáveis estão sinalizados com comentários HTML no formato:

```html
<!-- INÍCIO BLOCO NOME -->
...
<!-- FIM BLOCO NOME -->
```

1. Abra o arquivo desejado em um editor de texto.
2. Localize o bloco que deseja alterar usando o nome no comentário.
3. Substitua o texto entre os comentários pelo novo conteúdo.
4. Salve o arquivo — não é necessário alterar nenhuma classe ou estrutura.

### Troca de imagens

- Substitua os arquivos dentro de `assets/img/` pelos novos visuais mantendo os mesmos nomes (`hero-overlay.svg`, `favicon.svg`) ou atualize o atributo `src` das imagens correspondentes.
- Utilize imagens em alta resolução e com contraste adequado. As imagens atuais são placeholders e podem ser sobrescritas.

### Fontes

- A fonte **Poppins** é carregada do Google Fonts no `<head>` de cada página.
- A fonte **League Gothic** é importada via regra `@font-face` em `assets/css/styles.css`. Para usar um arquivo local, substitua a URL remota pela localização desejada.

### Cores e estilos globais

- Ajuste as cores principais alterando as variáveis CSS em `assets/css/styles.css` (`--color-background`, `--color-foreground`, etc.).
- Personalizações de sombra, bordas e espaçamentos também podem ser feitas diretamente nesse arquivo.

### Menu mobile e interações

- O comportamento do menu hamburguer está em `assets/js/main.js`. Caso deseje personalizar animações ou eventos adicionais, edite esse arquivo.

## Analytics

Existe um script de analytics comentado no final de cada página HTML. Basta remover os comentários e ajustar a URL para ativá-lo.

## Visualizar localmente

Abra qualquer arquivo `.html` diretamente no navegador. Por utilizar apenas HTML/CSS/JS simples, não há necessidade de servidor ou build.
