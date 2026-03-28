import { LabelSize, Palette, ThemeDefinition } from "../types";

export const LABEL_SIZES: LabelSize[] = [
  {
    id: "classic",
    name: {
      es: "Clasica",
      en: "Classic",
    },
    description: {
      es: "63.5 x 38.1 mm · 21 etiquetas por A4",
      en: "63.5 x 38.1 mm · 21 labels per A4",
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
    },
    description: {
      es: "88.9 x 50.8 mm · 10 etiquetas por A4",
      en: "88.9 x 50.8 mm · 10 labels per A4",
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
    },
    description: {
      es: "50.8 x 50.8 mm · 15 etiquetas por A4",
      en: "50.8 x 50.8 mm · 15 labels per A4",
    },
    widthMm: 50.8,
    heightMm: 50.8,
    columns: 3,
    rows: 5,
    gapMm: 4,
  },
];

export const THEMES: ThemeDefinition[] = [
  {
    id: "postage",
    name: {
      es: "Correo de papel",
      en: "Paper post",
    },
  },
  {
    id: "moon",
    name: {
      es: "Cielo de bolsillo",
      en: "Pocket sky",
    },
  },
  {
    id: "garden",
    name: {
      es: "Jardin secreto",
      en: "Secret garden",
    },
  },
  // Temporarily disabled from rotation while we rework it.
  // {
  //   id: "garden-night",
  //   name: {
  //     es: "Jardin nocturno",
  //     en: "Night garden",
  //   },
  // },
  {
    id: "circus-night",
    name: {
      es: "Circo nocturno",
      en: "Circus night",
    },
  },
  {
    id: "cloud-mail",
    name: {
      es: "Correo en nubes",
      en: "Cloud mail",
    },
  },
  {
    id: "sunny-kitchen",
    name: {
      es: "Cocina soleada",
      en: "Sunny kitchen",
    },
  },
  {
    id: "desk-treasures",
    name: {
      es: "Tesoro de escritorio",
      en: "Desk treasures",
    },
  },
  {
    id: "flowers",
    name: {
      es: "Lluvia de flores",
      en: "Flower confetti",
    },
  },
  {
    id: "rainbow",
    name: {
      es: "Arcoiris",
      en: "Rainbow",
    },
  },
  {
    id: "hearts",
    name: {
      es: "Lluvia de corazones",
      en: "Heart confetti",
    },
  },
  {
    id: "geometrics",
    name: {
      es: "Trama bonita",
      en: "Pretty weave",
    },
  },
  {
    id: "stars",
    name: {
      es: "Lluvia de estrellas",
      en: "Star confetti",
    },
  },
  {
    id: "confetti",
    name: {
      es: "Confetti dulce",
      en: "Sweet confetti",
    },
  },
  {
    id: "undersea",
    name: {
      es: "Fondo marino",
      en: "Undersea",
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
