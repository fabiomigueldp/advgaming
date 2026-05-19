# Adventury Starter Pack — Demo v1

Pack de demonstração pronto para usar em cena.

## O que tem no pacote

- 5 cores: `amarelo`, `azul`, `roxo`, `verde`, `vermelho`
- 3 cenas por cor (`aguardo`, `offline`, `stream`)
- Apenas arquivos finais em `.png`
- Template e gerador de colecao para OBS Studio
- Licenca de uso em `LICENCA.txt`

## O que não vem

- Arquivos editáveis (`.psd`)
- Fontes, paletas e matrizes de produção
- Arquivos internos de organização do projeto

## Estrutura

```text
adventury-starter-pack-demo-v1/
  README.md
  INVENTARIO.txt
  LICENCA.txt
  obs/
    README-OBS.md
    gerar-colecao-obs.ps1
    Adventury Starter Pack Demo v1.template.json
  assets/
    amarelo/
      01-aguardo.png
      02-offline.png
      03-stream.png
    azul/
      01-aguardo.png
      02-offline.png
      03-stream.png
    roxo/
      01-aguardo.png
      02-offline.png
      03-stream.png
    verde/
      01-aguardo.png
      02-offline.png
      03-stream.png
    vermelho/
      01-aguardo.png
      02-offline.png
      03-stream.png
```

## Como usar

1. Baixe e extraia o `.zip`.
2. Entre na pasta da cor desejada.
3. Use em OBS/Streamlabs/XSplit como fonte de imagem (PNG com fundo transparente).
4. Ajuste escala, corte e posição conforme sua cena.

Resolução base: `1920x1080`.

## OBS Studio

Para criar a colecao pronta do OBS:

1. Extraia o ZIP completo.
2. Abra a pasta `obs`.
3. Execute `gerar-colecao-obs.ps1`.
4. Importe o arquivo gerado `Adventury Starter Pack Demo v1.json` no OBS em `Scene Collection > Import`.

O gerador cria 15 cenas, uma para cada combinacao de cor e tipo de tela.

## Licenca

Leia `LICENCA.txt` antes de usar. Em resumo: voce pode usar nas suas proprias lives e videos, inclusive monetizados, mas nao pode revender, redistribuir, sublicenciar ou compartilhar os arquivos originais.
