"""
generate_icons.py
Gera todos os ícones PWA necessários a partir do logotipo.png.

Como usar:
  1. Instale a dependência (só precisa fazer uma vez):
       pip install Pillow

  2. Coloque este arquivo na RAIZ do seu projeto (onde estão src/, frontend/, etc.)

  3. Execute:
       python generate_icons.py

  Os ícones serão salvos em src/images/icons/
"""

from pathlib import Path
from PIL import Image, ImageDraw

# ── Configurações ────────────────────────────────────────────────────────────
SOURCE     = Path("src/images/logotipo.png")   # imagem de origem
OUTPUT_DIR = Path("src/images/icons")          # onde salvar os ícones
SIZES      = [72, 96, 128, 144, 152, 192, 384, 512]
BG_COLOR   = (11, 21, 48)   # --azul-noite (#0b1530) — cor de fundo para maskable
PADDING    = 0.15            # 15% de padding seguro para ícones maskable
# ─────────────────────────────────────────────────────────────────────────────


def make_square_transparent(img: Image.Image) -> Image.Image:
    """Converte a imagem para RGBA e coloca em canvas quadrado."""
    img = img.convert("RGBA")
    w, h = img.size
    size = max(w, h)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - w) // 2, (size - h) // 2)
    canvas.paste(img, offset, img)
    return canvas


def make_maskable(img: Image.Image, size: int) -> Image.Image:
    """
    Cria versão maskable: fundo azul sólido + logo centralizado
    com 15% de padding para respeitar a safe zone circular.
    """
    canvas = Image.new("RGBA", (size, size), (*BG_COLOR, 255))
    logo_size = int(size * (1 - PADDING * 2))
    logo = img.resize((logo_size, logo_size), Image.LANCZOS)
    offset = (size - logo_size) // 2
    canvas.paste(logo, (offset, offset), logo)
    return canvas


def main():
    if not SOURCE.exists():
        print(f"❌  Arquivo não encontrado: {SOURCE}")
        print("    Verifique se logotipo.png está em src/images/")
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    source_img = make_square_transparent(Image.open(SOURCE))

    for size in SIZES:
        # Ícone padrão (transparente)
        icon = source_img.resize((size, size), Image.LANCZOS)
        out_path = OUTPUT_DIR / f"icon-{size}.png"
        icon.save(out_path, "PNG", optimize=True)
        print(f"✅  {out_path}  ({size}×{size})")

    print(f"\n🎉  {len(SIZES)} ícones gerados em {OUTPUT_DIR}/")
    print("    Agora reinicie o servidor: bin/bridgetown start")


if __name__ == "__main__":
    main()