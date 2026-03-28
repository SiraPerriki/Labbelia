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
  },
  appSubtitle: {
    es: "Etiquetas bonitas para journaling",
    en: "Beautiful labels for journaling",
  },
  appDescription: {
    es: "Genera preguntas bonitas, elige las que más te llamen y compón una hoja A4 lista para imprimir o guardar.",
    en: "Generate beautiful prompts, keep the ones that call to you, and compose an A4 sheet ready to print or save.",
  },
  batchTitle: {
    es: "Mesa de descubrimiento",
    en: "Discovery table",
  },
  sheetTitle: {
    es: "Hoja A4",
    en: "A4 sheet",
  },
  sheetSubtitle: {
    es: "Llena la página con tus etiquetas favoritas.",
    en: "Fill the page with your favorite labels.",
  },
  sizeTitle: {
    es: "Tamaños estándar",
    en: "Standard sizes",
  },
  categoryTitle: {
    es: "Temas",
    en: "Themes",
  },
  refill: {
    es: "Generar nuevas",
    en: "Generate new ones",
  },
  autofill: {
    es: "Rellenar A4",
    en: "Fill A4",
  },
  clear: {
    es: "Vaciar hoja",
    en: "Clear sheet",
  },
  add: {
    es: "Añadir",
    en: "Add",
  },
  added: {
    es: "Ya está en la hoja",
    en: "Already on the sheet",
  },
  remove: {
    es: "Quitar",
    en: "Remove",
  },
  exportSvg: {
    es: "Descargar A4 SVG",
    en: "Download A4 SVG",
  },
  exportPng: {
    es: "Descargar A4 PNG",
    en: "Download A4 PNG",
  },
  exportPdf: {
    es: "Imprimir / PDF",
    en: "Print / PDF",
  },
  downloadSvg: {
    es: "SVG individual",
    en: "Single SVG",
  },
  capacity: {
    es: "Capacidad",
    en: "Capacity",
  },
  selected: {
    es: "Seleccionadas",
    en: "Selected",
  },
  promptBank: {
    es: "Banco curado",
    en: "Curated bank",
  },
  curationNote: {
    es: "La numeración original se ignora y las repeticiones semánticas se cortan sin miedo.",
    en: "Original numbering is ignored and semantic duplicates are trimmed without mercy.",
  },
  printHint: {
    es: "Para PDF, usa el diálogo de impresión del navegador con fondo activado.",
    en: "For PDF, use the browser print dialog with background graphics enabled.",
  },
  allCategories: {
    es: "Todas",
    en: "All",
  },
  emptySheet: {
    es: "Tu A4 está vacío todavía. Añade etiquetas desde la mesa.",
    en: "Your A4 is still empty. Add labels from the table.",
  },
  miniLore: {
    es: "Sello antiguo, feria, órbitas suaves, flores, nubes y bichitos. Todo convive en el mismo universo.",
    en: "Antique stamps, fair tickets, soft orbits, flowers, clouds, and tiny critters. Everything lives in the same universe.",
  },
};
