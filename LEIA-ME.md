# Murais AR — como organizar

```
raiz do repositório
├── index.html            ← lista dos murais (opcional, só para você)
├── get/                  ← mural GET (pronto)
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   ├── targets.mind
│   ├── video.mp4
│   └── icon-*.png, apple-touch-icon.png
└── modelo/               ← NÃO publique preenchido; use só para copiar
```

Cada mural fica na própria pasta e tem endereço próprio:
`https://SEU-USUARIO.github.io/SEU-REPO/get/`  (esse é o link do QR code).

## Criar um mural novo
1. Copie a pasta `modelo` e renomeie (minúsculas, sem espaço nem acento): `mural2`.
2. Coloque nela o `targets.mind` (gerado no compilador com a nova imagem) e o `video.mp4`.
3. `index.html`: troque `NOME DO MURAL` em `<title>` e em `apple-mobile-web-app-title`.
4. `index.html`: ajuste a altura do `<a-video>` se o vídeo não for 16:9
   (height = altura ÷ largura; 16:9 = 0.5625, 4:3 = 0.75).
5. `manifest.webmanifest`: troque `name` e `short_name`.
6. Troque os 4 ícones (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`,
   `apple-touch-icon.png`) pelos do novo mural.
7. Em `index.html` da raiz, copie a linha `<a class="card" ...>` para listar o mural.
8. Envie tudo ao GitHub e gere o QR code de `.../mural2/`.

Não precisa editar o `service-worker.js`: o cache de cada mural tem nome próprio,
criado a partir da pasta.

## Atualizei um mural e o celular mostra o antigo
Abra o `service-worker.js` daquele mural e troque `const VERSAO = 'v1';` por `'v2'`
(depois `'v3'`, etc.). Só esse mural é atualizado.
