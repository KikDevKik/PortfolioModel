# Deiner Trelles — Portfolio editorial

Tu portfolio funciona como una revista:

- **Portada** (la página de inicio): tu nombre como cabecera, la foto de portada y el sumario de proyectos al lado.
- **Cada proyecto es una "edición"** con su propia portada, sus páginas interiores y sus créditos al final.
- **Work**: la pared de todas las ediciones, como un kiosco de revistas.
- **Runway**: solo las pasarelas, en fondo negro.
- **Digitals**: polaroids, medidas y comp card.
- **Agency**: Saulo Dellano (agencia madre), Row (Colombia) y tu contacto directo.
- **Cine Vivo**: está **oculto**. Aparece solo, en el menú y en la portada, el día que publiques la primera escena.

Al hacer scroll, cada pantalla sube y se coloca encima de la anterior, como un paso de página.

---

## Cómo funciona (en una frase)

**Las fotos y videos viven en Cloudinary. Los textos viven en el panel (`tuweb.com/keystatic`). Vercel publica la web.**

Nunca tienes que tocar código para subir contenido.

---

## Montaje inicial (una sola vez, unos 30–40 minutos)

### Paso 1 — Subir el proyecto a GitHub
1. Entra a github.com → botón **New** (nuevo repositorio).
2. Nombre: `deiner-trelles-portfolio`. Márcalo como **Private**. No marques ninguna otra opción. **Create repository**.
3. En la página del repositorio vacío, pulsa **"uploading an existing file"**.
4. Descomprime el `.zip` que te di y arrastra **todo el contenido de la carpeta** (no la carpeta en sí) a la página. Pulsa **Commit changes**.

### Paso 2 — Cloudinary: copiar tus claves
1. Entra a cloudinary.com → **Dashboard** (o **Settings → API Keys**).
2. Copia en una nota tres datos: **Cloud name**, **API Key** y **API Secret**.

### Paso 3 — Publicar en Vercel
1. Entra a vercel.com → **Add New → Project** → elige el repositorio `deiner-trelles-portfolio` → **Import**.
2. Antes de pulsar Deploy, abre **Environment Variables** y añade:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | tu Cloud name |
| `CLOUDINARY_API_KEY` | tu API Key |
| `CLOUDINARY_API_SECRET` | tu API Secret |

3. Pulsa **Deploy**. En 1–2 minutos tendrás una dirección tipo `deiner-trelles-portfolio.vercel.app`.

> Hasta que subas fotos a Cloudinary verás rectángulos grises con el nombre del archivo que falta. Es normal: es el "modo demo".

### Paso 4 — Activar el panel de edición (Keystatic Cloud)
1. Entra a **keystatic.cloud** e inicia sesión con tu cuenta de GitHub.
2. Crea un **team** (por ejemplo `deiner`) y dentro un **project** (por ejemplo `portfolio`), conectado a tu repositorio `deiner-trelles-portfolio`.
3. Vuelve a Vercel → tu proyecto → **Settings → Environment Variables** y añade:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT` | `deiner/portfolio` (team/project, como lo hayas llamado) |
| `NEXT_PUBLIC_SITE_URL` | la dirección de tu web, ej. `https://deiner-trelles-portfolio.vercel.app` |

4. **Deployments** → en el último, menú **⋯ → Redeploy**.
5. Entra a `tuweb.com/keystatic`. Ese es tu panel.

Cada vez que guardas algo en el panel, se publica solo en 1–2 minutos.

### Paso 5 (opcional) — Tu propio dominio
Vercel → tu proyecto → **Settings → Domains** → escribe tu dominio (ej. `deinertrelles.com`) y sigue las instrucciones. Después actualiza `NEXT_PUBLIC_SITE_URL`.

---

## Cloudinary: estructura de carpetas

Organizamos **por proyecto**, no por tipo de foto. El tipo (editorial, campaña, pasarela…) se elige en el panel.

```
portfolio/
├── site/                                  → portada principal y su recorte
├── digitals/                              → tus 4 polaroids actuales
├── work/
│   ├── 2026-06_undergold-act-i/
│   ├── 2026-07_undergold-colombia-moda/
│   ├── 2026_galore-los-angeles/
│   ├── 2026_ofistudio-yeremysteven/
│   ├── 2026_emmanuel-ph-work-i/
│   ├── 2026_saint-theory/
│   └── 2026_quaint/
├── cine-vivo/
│   └── 01_nombre-de-la-escena/
└── documents/                             → comp card en PDF
```

Nombre de carpeta: **`año-mes_nombre-del-proyecto`**, todo en minúsculas y con guiones. El año y mes al inicio hace que en Cloudinary se ordenen solas por fecha.

## Cloudinary: cómo nombrar los archivos

**`nombre-del-proyecto_NN`**, con el número siempre a dos cifras.

```
undergold-act-i_01.jpg
undergold-act-i_02.jpg
...
undergold-act-i_cover.jpg           ← la portada
undergold-act-i_cover-cutout.png    ← la portada sin fondo (opcional)
undergold-act-i_video_01.mp4        ← video
```

Reglas importantes:
- **El número decide el orden** de las páginas en la web. ¿Quieres cambiar el orden? Cambia los números.
- Los archivos que terminan en **`_cover`** o **`_cover-cutout`** no se repiten dentro de la edición. Así se evita la foto triplicada del portfolio de Canva.
- **La web decide sola el diseño de cada página**: una foto horizontal ocupa toda la pantalla; dos verticales seguidas van enfrentadas (en el celular se deslizan); una vertical sola va a un lado con el número de página al otro.
- **Curación:** entre 6 y 12 fotos por proyecto. Menos es más para un booker.

Al subir a Cloudinary, en la carpeta correcta, la foto aparece en la web en un máximo de 5 minutos.

---

## Tareas del día a día

### Publicar un proyecto nuevo
1. **Cloudinary:** crea la carpeta `portfolio/work/AAAA-MM_nombre` y sube las fotos ya nombradas.
2. **Panel** (`tuweb.com/keystatic`) → **Projects (issues)** → **+**.
3. Rellena: título, número de edición (el siguiente al último), tipo, fecha, marca, carpeta de Cloudinary, portada y créditos.
4. **Save.** En 1–2 minutos está publicado.

### Poner la foto de portada
En Cloudinary, abre la foto → copia su **Public ID** → pégalo en **Cover → Cover photo** dentro del panel.

Una buena portada es vertical, con mirada fuerte y espacio arriba para "DEINER".

### El efecto de "cabeza delante del logo"
1. Toma la **misma foto de portada**, mismo tamaño, y quítale el fondo (en Cloudinary con *Background removal*, o en remove.bg). Guárdala como **PNG**.
2. Súbela como `…_cover-cutout.png` y pega su Public ID en **Cover → Cutout**.

Si el recorte no tiene exactamente el mismo tamaño que la portada, la cabeza saldrá desplazada.

### Cambiar el color de una edición
En **Cover → Accent color**, pon un color sacado de la foto (dorado para Undergold, rosa para Galore…). Se usa en el titular, en el sumario y en los números de página.

### Actualizar digitals y medidas
- Sube las nuevas polaroids a `portfolio/digitals/` (`digitals_01.jpg` … `digitals_04.jpg`) y borra las viejas.
- En el panel → **Site settings → Measurements**, actualiza las medidas y la fecha **"Digitals updated"**.

### Comp card
Sube el PDF a Cloudinary (`portfolio/documents/`), copia su enlace y pégalo en **Site settings → Comp card PDF link**. Aparecerá un botón de descarga junto a tus medidas.

### Publicar la primera escena de Cine Vivo
1. **Cloudinary:** crea `portfolio/cine-vivo/01_nombre-escena/` y sube los stills y el video.
2. **Panel** → **Cine Vivo** → **+**. Rellena canción, artista, concepto, carpeta, still de portada y color.
3. Marca **Published** y guarda.

La sección aparece sola en el menú, en la portada y con su propia página oscura tipo película.

### Ocultar un proyecto sin borrarlo
Panel → el proyecto → desmarca **Published**.

---

## Pendientes antes de lanzar

- [ ] Subir las fotos originales en alta resolución (exportadas, no capturas de Canva).
- [ ] Fechas reales de Galore, OFISTUDIO, Emmanuel, Saint Theory, QUAINT y Colombia Moda.
- [ ] Confirmar el orden de las ediciones (el número de edición de cada proyecto).
- [ ] Créditos completos de Saint Theory y QUAINT (fotógrafo, estilista, dirección).
- [ ] Datos de contacto de Row MGMT (booker, correo, Instagram).
- [ ] Confirmar el nivel de inglés y si el color de pelo sigue siendo blanco y negro.
- [ ] Inseam (largo de pierna).
- [ ] Titular de la portada principal.

---

## Para quien edite el código en el futuro

- Next.js 15 (App Router) + Keystatic (contenido en `content/`, panel en `/keystatic`) + Cloudinary (Search API, `lib/cloudinary.ts`).
- Las páginas se regeneran cada 5 minutos (`revalidate = 300`) para recoger fotos nuevas de Cloudinary.
- Sin variables de Cloudinary, la web funciona en modo demo con imágenes de relleno.
- Diseño: `app/globals.css`. Portada: `components/Cover.tsx`. Páginas dobles: `lib/spreads.ts` y `components/SpreadPages.tsx`.
- Desarrollo local: `npm install` y luego `npm run dev`.
