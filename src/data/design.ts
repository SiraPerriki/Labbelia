import { LabelSize, Palette, ThemeDefinition } from "../types";

export const LABEL_SIZES: LabelSize[] = [
  {
    id: "mini",
    name: {
      es: "Mini",
      en: "Mini",
      ga: "Mini",
      ja: "ミニ",
    },
    description: {
      es: "66.8 x 27.4 mm · 30 tiritas por A4",
      en: "66.8 x 27.4 mm · 30 strips per A4",
      ga: "66.8 x 27.4 mm · 30 etiquetas por A4",
      ja: "66.8 x 27.4 mm · A4に30枚",
    },
    widthMm: 66.8,
    heightMm: 27.4,
    columns: 3,
    rows: 10,
    gapMm: 1.5,
  },
  {
    id: "classic",
    name: {
      es: "Clásica",
      en: "Classic",
      ga: "Clasica",
      ja: "クラシック",
    },
    description: {
      es: "63.5 x 38.1 mm · 21 etiquetas por A4",
      en: "63.5 x 38.1 mm · 21 labels per A4",
      ga: "63.5 x 38.1 mm · 21 etiquetas por A4",
      ja: "63.5 x 38.1 mm · A4に21枚",
    },
    widthMm: 63.5,
    heightMm: 38.1,
    columns: 3,
    rows: 7,
    gapMm: 3,
  },
  {
    id: "wide",
    name: {
      es: "Ticket ancho",
      en: "Wide ticket",
      ga: "Ticket ancho",
      ja: "ワイド",
    },
    description: {
      es: "88.9 x 50.8 mm · 10 etiquetas por A4",
      en: "88.9 x 50.8 mm · 10 labels per A4",
      ga: "88.9 x 50.8 mm · 10 etiquetas por A4",
      ja: "88.9 x 50.8 mm · A4に10枚",
    },
    widthMm: 88.9,
    heightMm: 50.8,
    columns: 2,
    rows: 5,
    gapMm: 4,
  },
  {
    id: "square",
    name: {
      es: "Cuadrada",
      en: "Square",
      ga: "Cadrada",
      ja: "スクエア",
    },
    description: {
      es: "66 x 66 mm · 12 trackers por A4",
      en: "66 x 66 mm · 12 trackers per A4",
      ga: "66 x 66 mm · 12 trackers por A4",
      ja: "66 x 66 mm · A4に12枚",
    },
    widthMm: 66,
    heightMm: 66,
    columns: 3,
    rows: 4,
    gapMm: 2.2,
  },
];

export const THEMES: ThemeDefinition[] = [
  {
    id: "postage",
    name: {
      es: "Correo de papel",
      en: "Paper post",
      ga: "Correo de papel",
    },
  },
  {
    id: "moon",
    name: {
      es: "Cielo de bolsillo",
      en: "Pocket sky",
      ga: "Ceo de peto",
    },
  },
  {
    id: "garden",
    name: {
      es: "Jardín secreto",
      en: "Secret garden",
      ga: "Xardin secreto",
    },
  },
  // Temporarily disabled from rotation while we rework it.
  // {
  //   id: "garden-night",
  //   name: {
  //     es: "Jardín nocturno",
  //     en: "Night garden",
  //     ga: "Xardin nocturno",
  //   },
  // },
  {
    id: "circus-night",
    name: {
      es: "Circo nocturno",
      en: "Circus night",
      ga: "Circo nocturno",
    },
  },
  {
    id: "cloud-mail",
    name: {
      es: "Correo en nubes",
      en: "Cloud mail",
      ga: "Correo nas nubes",
    },
  },
  {
    id: "forest-cabin",
    name: {
      es: "Cabana del bosque",
      en: "Forest cabin",
      ga: "Cabana do bosque",
    },
  },
  {
    id: "mushrooms",
    name: {
      es: "Setitas suaves",
      en: "Soft mushrooms",
      ga: "Cogomelos suaves",
    },
  },
  {
    id: "ribbons",
    name: {
      es: "Cintas bonitas",
      en: "Pretty ribbons",
      ga: "Cintas bonitas",
    },
  },
  {
    id: "fruits",
    name: {
      es: "Frutitas",
      en: "Little fruits",
      ga: "Froitiñas",
    },
  },
  {
    id: "kawaii-clouds",
    name: {
      es: "Nubes kawaii",
      en: "Kawaii clouds",
      ga: "Nubes kawaii",
    },
  },
  {
    id: "sunny-kitchen",
    name: {
      es: "Cocina soleada",
      en: "Sunny kitchen",
      ga: "Cocina soleada",
    },
  },
  {
    id: "desk-treasures",
    name: {
      es: "Tesoro de escritorio",
      en: "Desk treasures",
      ga: "Tesouro de escritorio",
    },
  },
  {
    id: "flowers",
    name: {
      es: "Lluvia de flores",
      en: "Flower confetti",
      ga: "Choiva de flores",
    },
  },
  {
    id: "bows",
    name: {
      es: "Mariposas",
      en: "Butterflies",
      ga: "Bolboretas",
    },
  },
  {
    id: "rainbow",
    name: {
      es: "Arcoíris",
      en: "Rainbow",
      ga: "Arco da vella",
    },
  },
  {
    id: "stripes-vertical",
    name: {
      es: "Rayas verticales",
      en: "Vertical stripes",
      ga: "Raias verticais",
    },
  },
  {
    id: "stripes-horizontal",
    name: {
      es: "Rayas horizontales",
      en: "Horizontal stripes",
      ga: "Raias horizontais",
    },
  },
  {
    id: "hearts",
    name: {
      es: "Lluvia de corazones",
      en: "Heart confetti",
      ga: "Choiva de corazons",
    },
  },
  {
    id: "geometrics",
    name: {
      es: "Trama bonita",
      en: "Pretty weave",
      ga: "Trama bonita",
    },
  },
  {
    id: "stars",
    name: {
      es: "Lluvia de estrellas",
      en: "Star confetti",
      ga: "Choiva de estrelas",
    },
  },
  {
    id: "confetti",
    name: {
      es: "Confeti dulce",
      en: "Sweet confetti",
      ga: "Confetti doce",
    },
  },
  {
    id: "undersea",
    name: {
      es: "Fondo marino",
      en: "Undersea",
      ga: "Fondo marino",
    },
  },
  {
    id: "matcha-cafe",
    name: {
      es: "Café Matcha",
      en: "Matcha cafe",
      ga: "Café Matcha",
    },
  },
];

export const PALETTES: Palette[] = [
  {
    paper: "#fff4f1",
    border: "#bb8c96",
    ink: "#5f4950",
    accent: "#efb5c5",
    soft: "#f9dfe7",
    pop: "#f4c79f",
  },
  {
    paper: "#fff8f3",
    border: "#c89a8f",
    ink: "#664f4a",
    accent: "#f2c8bf",
    soft: "#fae1db",
    pop: "#f3cd92",
  },
  {
    paper: "#fdf5ff",
    border: "#ab96c5",
    ink: "#564d67",
    accent: "#d2c1ec",
    soft: "#ece2fb",
    pop: "#f3c9a2",
  },
  {
    paper: "#f7fbf8",
    border: "#88a79a",
    ink: "#4d6058",
    accent: "#b9d8cc",
    soft: "#deefe8",
    pop: "#f3cf99",
  },
  {
    paper: "#fff7ef",
    border: "#c19b73",
    ink: "#66533e",
    accent: "#f0d2a5",
    soft: "#f8e8c9",
    pop: "#e8ae92",
  },
  {
    paper: "#fff7fa",
    border: "#d29cab",
    ink: "#664a52",
    accent: "#f2c3d2",
    soft: "#f9e2ea",
    pop: "#f5d1a1",
  },
  {
    paper: "#f6fbff",
    border: "#8ca7c6",
    ink: "#4a596d",
    accent: "#bfd4ee",
    soft: "#e0ecf8",
    pop: "#f0c69b",
  },
  {
    paper: "#fcf6f0",
    border: "#ba9386",
    ink: "#634f49",
    accent: "#e6beb4",
    soft: "#f3ddd6",
    pop: "#efc58c",
  },
  {
    paper: "#fef8f7",
    border: "#c3889d",
    ink: "#5f4451",
    accent: "#efbfd0",
    soft: "#f9dde7",
    pop: "#f2c8ac",
  },
  {
    paper: "#fff6f2",
    border: "#b97d90",
    ink: "#5f4552",
    accent: "#f0aac4",
    soft: "#f9d2df",
    pop: "#f1b06f",
  },
  {
    paper: "#fcf7ff",
    border: "#978cc8",
    ink: "#544d69",
    accent: "#ceb2f6",
    soft: "#e7dbff",
    pop: "#efc46f",
  },
  {
    paper: "#f7fffb",
    border: "#80a398",
    ink: "#496158",
    accent: "#a7ddca",
    soft: "#d3f1e7",
    pop: "#eeaf84",
  },
  {
    paper: "#fff8f1",
    border: "#b68771",
    ink: "#664f44",
    accent: "#efbea0",
    soft: "#f8ddc8",
    pop: "#e89278",
  },
];
