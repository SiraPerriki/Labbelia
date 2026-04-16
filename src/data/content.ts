import { LocalizedText } from "../types";

interface UiCopy {
  appTitle: LocalizedText;
  appSubtitle: LocalizedText;
  appDescription: LocalizedText;
  batchTitle: LocalizedText;
  sheetTitle: LocalizedText;
  sheetSubtitle: LocalizedText;
  sizeTitle: LocalizedText;
  categoryTitle: LocalizedText;
  refill: LocalizedText;
  autofill: LocalizedText;
  clear: LocalizedText;
  add: LocalizedText;
  added: LocalizedText;
  remove: LocalizedText;
  exportSvg: LocalizedText;
  exportPng: LocalizedText;
  exportPdf: LocalizedText;
  downloadSvg: LocalizedText;
  capacity: LocalizedText;
  selected: LocalizedText;
  promptBank: LocalizedText;
  curationNote: LocalizedText;
  printHint: LocalizedText;
  allCategories: LocalizedText;
  emptySheet: LocalizedText;
  miniLore: LocalizedText;
}

export const UI_COPY: UiCopy = {
  appTitle: {
    es: "Labbelia",
    en: "Labbelia",
    ga: "Labbelia",
    ja: "Labbelia",
  },
  appSubtitle: {
    es: "Tiritas bonitas para journaling",
    en: "Pretty strips for journaling",
    ga: "Etiquetas bonitas para journaling",
    ja: "ジャーナリングのためのやさしいひとこと",
  },
  appDescription: {
    es: "Genera preguntas bonitas, elige las que más te llamen y compone una hoja A4 lista para imprimir o guardar.",
    en: "Generate beautiful prompts, keep the ones that call to you, and compose an A4 sheet ready to print or save.",
    ga: "Xera preguntas bonitas, escolle as que mais che chamen e compon unha folla A4 lista para imprimir ou gardar.",
    ja: "やさしいひとことを作成して、お気に入りを集めたA4シートを作りましょう。印刷したり保存できます。",
  },
  batchTitle: {
    es: "Mesa de descubrimiento",
    en: "Discovery table",
    ga: "Mesa de descuberta",
    ja: "見つけるテーブル",
  },
  sheetTitle: {
    es: "Hoja A4",
    en: "A4 sheet",
    ga: "Folla A4",
  },
  sheetSubtitle: {
    es: "Llena la página con tus tiritas favoritas.",
    en: "Fill the page with your favorite strips.",
    ga: "Enche a paxina coas tuas etiquetas favoritas.",
    ja: "お気に入りのひとことをシートにまとめましょう。",
  },
  sizeTitle: {
    es: "Tamaños estándar",
    en: "Standard sizes",
    ga: "Tamanos estandar",
    ja: "標準サイズ",
  },
  categoryTitle: {
    es: "Temas",
    en: "Themes",
    ga: "Temas",
    ja: "カテゴリー",
  },
  refill: {
    es: "Generar nuevas",
    en: "Generate new ones",
    ga: "Xerar novas",
    ja: "新しく作成する",
  },
  autofill: {
    es: "Rellenar A4",
    en: "Fill A4",
    ga: "Encher A4",
    ja: "A4を自動で埋める",
  },
  clear: {
    es: "Vaciar hoja",
    en: "Clear sheet",
    ga: "Baleirar folla",
    ja: "シートを空にする",
  },
  add: {
    es: "Añadir",
    en: "Add",
    ga: "Engadir",
    ja: "追加する",
  },
  added: {
    es: "Ya está en la hoja",
    en: "Already on the sheet",
    ga: "Xa esta na folla",
    ja: "追加済み",
  },
  remove: {
    es: "Quitar",
    en: "Remove",
    ga: "Quitar",
    ja: "外す",
  },
  exportSvg: {
    es: "Descargar A4 SVG",
    en: "Download A4 SVG",
    ga: "Descargar A4 SVG",
    ja: "A4 SVGを保存",
  },
  exportPng: {
    es: "Descargar A4 PNG",
    en: "Download A4 PNG",
    ga: "Descargar A4 PNG",
    ja: "A4 PNGを保存",
  },
  exportPdf: {
    es: "Imprimir / PDF",
    en: "Print / PDF",
    ga: "Imprimir / PDF",
    ja: "印刷 / PDF",
  },
  downloadSvg: {
    es: "SVG individual",
    en: "Single SVG",
    ga: "SVG individual",
    ja: "1枚をSVGで保存",
  },
  capacity: {
    es: "Capacidad",
    en: "Capacity",
    ga: "Capacidade",
    ja: "容量",
  },
  selected: {
    es: "Seleccionadas",
    en: "Selected",
    ga: "Seleccionadas",
    ja: "えらんだ枚数",
  },
  promptBank: {
    es: "Banco curado",
    en: "Curated bank",
    ga: "Banco curado",
    ja: "えりすぐりの言葉",
  },
  curationNote: {
    es: "La numeración original se ignora y las repeticiones semánticas se cortan sin miedo.",
    en: "Original numbering is ignored and semantic duplicates are trimmed without mercy.",
    ga: "A numeracion orixinal ignorase e as repeticions semanticas cortanse sen medo.",
    ja: "元の番号は無視され、意味の重複する言葉は大胆にカットされています。",
  },
  printHint: {
    es: "Para PDF, usa el diálogo de impresión del navegador con fondo activado.",
    en: "For PDF, use the browser print dialog with background graphics enabled.",
    ga: "Para PDF, usa o dialogo de impresion do navegador co fondo activado.",
    ja: "PDFにするときは、ブラウザの印刷画面で背景を有効にしてください。",
  },
  allCategories: {
    es: "Todas",
    en: "All",
    ga: "Todas",
    ja: "すべて",
  },
  emptySheet: {
    es: "Tu A4 está vacío todavía. Añade tiritas desde la mesa.",
    en: "Your A4 is still empty. Add strips from the table.",
    ga: "O teu A4 ainda esta baleiro. Engade etiquetas desde a mesa.",
    ja: "A4シートはまだ空です。ここからひとことを入れていきましょう。",
  },
  miniLore: {
    es: "Sello antiguo, feria, órbitas suaves, flores, nubes y bichitos. Todo convive en el mismo universo.",
    en: "Antique stamps, fair tickets, soft orbits, flowers, clouds, and tiny critters. Everything lives in the same universe.",
    ga: "Selo antigo, feira, orbitas suaves, flores, nubes e bechos pequenos. Todo convive no mesmo universo.",
    ja: "古い切手、遊園地、やわらかな軌道、花、なだらかな雲、そして小さな生き物たち。すべてが共存しています。",
  },
};
