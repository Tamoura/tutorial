---
version: alpha
name: Sukkarah
description: One printed Arabic sweets box, lid first, then opened; pistachio board, brass foil, rose seal and tissue, white sticker labels.
colors:
  board: "#4b6a2e"
  board-deep: "#34491f"
  rose: "#e2a3a8"
  rose-deep: "#a3445a"
  label-rule: "#c9677a"
  foil: "#e9c97f"
  foil-light: "#f6e3b4"
  tissue: "#f6dfe3"
  tissue-deep: "#ecc6ce"
  label: "#fffaf2"
  ink: "#1f2c14"
  ink-soft: "#46523a"
  on-board: "#f8f1e2"
  on-board-soft: "#dfe6cd"
typography:
  display:
    fontFamily: "Aref Ruqaa, Readex Pro, serif"
    fontSize: "6rem"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "Aref Ruqaa, Readex Pro, serif"
    fontSize: "4.25rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Aref Ruqaa, Readex Pro, serif"
    fontSize: "3.15rem"
    fontWeight: 700
    lineHeight: 1.25
  sticker-name:
    fontFamily: "Aref Ruqaa, Readex Pro, serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 350
    lineHeight: 1.7
  body-lead:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 350
    lineHeight: 1.8
  label:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 500
    lineHeight: 1.7
  fine:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 450
    lineHeight: 1.6
  wordmark-latin:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 500
    letterSpacing: "0.55em"
rounded:
  board: "0px"
  compartment: "0.15rem"
  chip: "0.25rem"
  photo: "0.3rem"
  action: "0.4rem"
  sticker: "0.6rem"
  window: "1.6rem"
spacing:
  gutter: "3rem"
  container: "82rem"
  band: "4.25rem"
  section: "8rem"
  sticker-pad: "2rem"
  crease-inset: "0.85rem"
  tray-gap: "0.75rem"
components:
  seal-band:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.ink}"
    height: "{spacing.band}"
  lang-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    height: "2.25rem"
  lang-toggle-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.rose}"
  action-primary:
    backgroundColor: "{colors.board}"
    textColor: "{colors.on-board}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "1.35rem"
    height: "3rem"
  action-primary-hover:
    backgroundColor: "{colors.board-deep}"
    textColor: "{colors.on-board}"
  sticker:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sticker}"
    padding: "{spacing.sticker-pad}"
  placeholder-tag:
    backgroundColor: "{colors.label}"
    textColor: "{colors.rose-deep}"
    rounded: "{rounded.chip}"
  caption-tag:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    typography: "{typography.fine}"
    rounded: "0.35rem"
  lid-window:
    backgroundColor: "{colors.tissue-deep}"
    rounded: "{rounded.window}"
    width: "36rem"
  tray:
    backgroundColor: "{colors.board}"
    rounded: "{rounded.photo}"
    padding: "{spacing.tray-gap}"
  tray-cell:
    backgroundColor: "{colors.tissue-deep}"
    rounded: "{rounded.compartment}"
  box-base:
    backgroundColor: "{colors.board-deep}"
    textColor: "{colors.on-board-soft}"
---

# Design System: Sukkarah

## Overview

**Creative North Star: "The Sweets Box"**

The whole site is one printed Sukkarah box held in the hands. Its outside is deep pistachio-green board with a brass-foil wordmark and a rose paper seal band across the top; its inside is rose tissue paper, and every piece of information is written on a white sticker label pressed onto the board or the tissue. The visitor sees the tray through a die-cut window in the lid, the lid lifts away as they scroll, and the rest of the page alternates between the inside of the box (tissue) and its outside (board), ending on the box's base.

Density is low and tactile. The real kitchen photographs carry the colour and appetite; the box supplies only flat printed board, foil, paper and labels around them. Arabic leads, right to left, with a Ruqʿah calligraphic voice for names and a clean Arabic sans for everything read. Depth is physical and sparing: a crease line, the bevel of the die-cut, and one cast shadow while the lid is in the air. The page is light-only (`color-scheme: light`); there is no dark theme.

The world rejects the cream-and-burgundy patisserie page: a hero photo over a row of equal product cards.

**Key Characteristics:**
- Two materials alternate by section: green board (outside of the box) and rose tissue (inside the box).
- Every piece of text that names or describes a sweet sits on a white sticker label with a double rose rule, set slightly askew.
- Photographs sit in die-cut openings and compartments, never as free-floating cards.
- Ruqʿah calligraphy for names and headings; Readex Pro for reading text and labels.
- One signature motion: the lid window widens and the lid lifts off, driven by scroll.

## Colors

A printed-board palette: one deep pistachio green carries the box, rose paper and tissue line it, brass foil marks the name, and near-white sticker stock holds the words.

### Primary
- **Pistachio Board** (`board`): the printed outside of the box. The lid face, the gift and visit sections, the tray frame that holds the compartments, and the fill of the primary action. Also the page `background`, `theme-color` and `accent-color`.
- **Board Shadow Green** (`board-deep`): the box's base (footer), the hairline that edges the die-cut window, and the hover state of the primary action.

### Secondary
- **Seal Rose** (`rose`): the paper seal band across the top of the box (header) and the ribbon that runs behind the gift tray. Also the text-selection colour.
- **Deep Rose Ink** (`rose-deep`): rose printing on light paper: the greeting printed under the lid and the "working name" placeholder tag. Text use only on tissue or label stock.
- **Sticker Rule Rose** (`label-rule`): the double border of every sticker label, the diamond separators in the contents list, and the faint dividers between field rows. Decorative only; never text.

### Tertiary
- **Brass Foil** (`foil`): the foil-stamped wordmark on the lid and the base, and display headings set on board. Display sizes only.
- **Pale Foil** (`foil-light`): the spaced Latin "SUKKARAH" beneath the foil wordmark on the lid.

### Neutral
- **Rose Tissue** (`tissue`): the inside lining. The section backgrounds of "inside the box" and "with coffee", and the space revealed when the lid lifts.
- **Folded Tissue** (`tissue-deep`): the image placeholder behind every photograph while it loads (window and compartments).
- **Sticker Stock** (`label`): the paper of every sticker label, caption tag and the skip link.
- **Board Ink** (`ink`): the body text colour on tissue, labels and the rose band; the default focus ring.
- **Faded Ink** (`ink-soft`): secondary text on labels and tissue: ledes, descriptions, notes, and the dotted fill-in lines.
- **Printed Cream** (`on-board`): text on the green board, chiefly the primary action label.
- **Printed Sage** (`on-board-soft`): running text on board sections and the base.

### Named Rules

**The Two Materials Rule.** A content section is either board or tissue, never a third surface; the only other surfaces are the rose seal band and paper pieces (stickers and tags). Board sections set text in Printed Cream, Printed Sage or Brass Foil; tissue sections set text in Board Ink, Faded Ink, or Deep Rose Ink at display size.

**The Foil Is For Display Rule.** Brass Foil on Pistachio Board reaches only large-text contrast, so it is used for the wordmark and for display-size headings, never for body or label text. Small text on board uses Pale Foil, Printed Cream or Printed Sage.

**The Rose Is Paper Rule.** Seal Rose is a paper (band, ribbon); Deep Rose Ink is a print colour; Sticker Rule Rose is a border. None of them fills a button or a large text block.

## Typography

**Display Font:** Aref Ruqaa (with Readex Pro, then serif)
**Body Font:** Readex Pro (with system-ui, then sans-serif)

**Character:** Ruqʿah is the hand of shop signs and handwritten labels, quick and confident; Readex Pro is a calm, even Arabic-and-Latin sans that keeps descriptions and fill-in fields legible at small sizes. Both are self-hosted woff2 files split by Arabic and Latin ranges; only Aref Ruqaa 700 is used in the build.

### Hierarchy
- **Display** (Aref Ruqaa 700, fluid up to the token size, line-height 1.15): the foil wordmark on the lid (from 4.25rem) and the greeting printed under the lid (from 3rem). The largest voice on the page and reserved for the box itself.
- **Headline** (Aref Ruqaa 700, fluid from 2.5rem, line-height 1.2, `text-wrap: balance`): section headings, in Board Ink on tissue or labels and Brass Foil on board. The visit label sets it smaller (up to 3.4rem).
- **Title** (Aref Ruqaa 700, fluid from 2.2rem, line-height 1.25): the headline on the lid sticker, the page's h1. On phones it is fixed at 2.05rem.
- **Sticker Name** (Aref Ruqaa 700, line-height 1.3): the name of each sweet on its compartment label.
- **Body** (Readex Pro 350, line-height 1.7): all reading text. Ledes and notes hold to about 36ch.
- **Body Lead** (Readex Pro 350, line-height 1.8): the short paragraphs in the gift and coffee passages.
- **Label** (Readex Pro 500): the contents list on the lid sticker and the action label. Navigation links use the same face at 0.95rem, weight 450.
- **Fine** (Readex Pro, line-height 1.6): caption tags and field names (field names at weight 500); sticker descriptions use the same leading at 0.9rem in body weight; fill-in placeholders drop to 0.72rem.
- **Wordmark Latin** (Readex Pro 500, uppercase by content, wide tracking): "SUKKARAH" under the Arabic wordmark. In the seal band it is 0.72rem at 0.32em tracking.

In English (LTR), body weight drops to 330 and Ruqʿah headings tighten to line-height 1.12 with -0.01em tracking.

### Named Rules

**The Ruqʿah Names Rule.** Aref Ruqaa is for names: the wordmark, headings, and the name of each sweet. Descriptions, lists, fields and navigation are always Readex Pro.

**The Light Body Rule.** Reading text is set light (350 in Arabic, 330 in English) on generous leading (1.7–1.8); weight 500 is kept for labels, field names and actions.

## Layout

A single scrolling box, sectioned edge to edge. Sections run full-bleed in their material; content inside them is held to an 82rem container centred with a fluid side gutter (1rem on phones up to 3rem). Section padding is fluid, roughly 4rem to 8rem top and bottom.

The first viewport is the lid: a sticky stage the height of the viewport minus the seal band, with the die-cut window on the reading-start side (right in Arabic) at about 40% of the width (capped at 36rem), and the foil wordmark and the sticker on the other side. The sticker overlaps the window edge by 4.5rem. With JavaScript and enough height, the lid section is extended by 62svh of scroll so the opening plays while the stage stays pinned.

"Inside the box" is a tray: a green board frame (0.75rem padding and gap) holding four compartments of unequal size on a 1.15 / 1 / 1.15 column grid, a tall kunafa compartment and a tall layered compartment flanking a stacked basbousa pair. Following passages are asymmetric two-column splits (photo against copy) that collapse to one column on phones.

Breakpoints: at 1080px the tray becomes two columns with the layered compartment spanning; at 760px everything is one column, the seal band grows to 6rem and wraps the navigation onto its own row, and compartment labels move below their photographs, overlapping them by 2.25rem.

## Elevation & Depth

The box is flat printed board. Depth comes from the material itself: a single blind-embossed crease line inset from the lid edge, the bevel of the die-cut window, and labels that sit slightly askew as if pressed on by hand. There is exactly one cast shadow, and it exists only while the lid is in the air.

### Shadow Vocabulary
- **Lid lift** (dynamic: `0 calc(lift × 2.5rem) calc(lift × 4rem)` in Board Ink, alpha peaking mid-lift and returning to zero): the shadow under the lid as it rises. Zero at rest and zero once lifted.
- **Window bevel** (inset 1px Board Shadow Green edge, a 3px white highlight at 10%, and a soft 14px inner shade at the top): the cut edge of the board around the window. A faint diagonal cellophane sheen crosses the window.
- **Crease** (1px border in Board Ink at 35%, with 1px white highlights at 9%): the folded edge of the lid, inset 0.85rem.

### Named Rules

**The One Cast Shadow Rule.** Nothing on the page casts a drop shadow except the lid while it lifts. Stickers, photos, buttons and the tray sit flat on their material.

**The Hand-Pressed Label Rule.** Sticker labels may rotate by up to about one degree (-1deg, 0.6deg, 0.8deg in use); photographs, the tray and the window never rotate.

## Shapes

Board is square: section edges, the lid and the base have no radius. Openings cut into the board are rounded: the die-cut window is the softest shape on the page (1.6rem), photographs in passages have a slight 0.3rem corner, and compartments inside the tray are nearly square (0.15rem). Sticker labels have a 0.6rem corner and a double rule: an outer 1.5px Sticker Rule Rose border plus a 1px outline of the same rose inset 7px. Small paper pieces (placeholder tag, language toggle) use a 0.25rem corner. Small diamonds (a square rotated 45°) are the recurring mark: the dot above the kāf in the wordmark and the separators in the contents list.

## Components

### Buttons
Printed and firm: the primary action is a block of the board colour, the only filled control on the page.
- **Shape:** gently squared (`rounded.action`), at least 3rem tall.
- **Primary:** Pistachio Board fill, Printed Cream label in Readex Pro 500, with a drawn SVG down-arrow (stroke 1.8) after the label.
- **Hover / Focus:** fill deepens to Board Shadow Green over 0.25s on the house ease-out; the arrow drops 3px over 0.35s. Focus is a 2px Board Ink outline offset 3px.
- **Language toggle:** a transparent 1px Board Ink outlined chip in the seal band ("EN" / "ع"), at least 2.75rem × 2.25rem; on hover it inverts to Board Ink with Seal Rose text.

### Sticker Labels
The signature container. Sticker Stock paper, Board Ink text, a double Sticker Rule Rose rule, a 0.6rem corner and fluid padding (about 1.4rem to 2rem). Used for the lid sticker (headline, lede, contents list and action), for each compartment's name and description, and for the visit label with its field rows. Placement is set askew by up to a degree.

### Placeholders and Fields
Unconfirmed facts are shown as blanks on the label, never invented.
- **Fill-in field:** a field name in Readex Pro 500 beside a dotted 1.5px Faded Ink underline with a small Faded Ink "not set yet" note. In the visit label, field rows sit on a 7.5rem name column (6.5rem on phones) with faint rose dividers.
- **Placeholder tag:** a small outlined tag in Deep Rose Ink (1px border in the text colour, `rounded.chip`) beside a working product name.

### Seal Band (Navigation)
The rose paper band across the top of the box, with a hairline Board Ink rule above and below. The Ruqʿah wordmark (1.85rem) and spaced Latin name sit at the start; four section links in Board Ink follow, underlined on hover with a 1px line offset 0.45em; the language toggle closes the row. On phones the links wrap to a full-width second row spread edge to edge.

### The Lid (signature)
The first viewport. A green board layer with a die-cut window over the real tray photograph, the foil wordmark, the crease, and the lid sticker. As the visitor scrolls, the window first widens (from about 40vw toward 56vw, capped at 50rem, over the first 40% of progress), then the whole board lifts up and off (from 30% to 100%, rising 104% of its height and scaling up 3%) to reveal the tray on rose tissue with the greeting "بالهنا والعافية" printed beside it in Deep Rose Ink. Progress is eased with a cubic ease-out and scrubbed by scroll, so scrolling back closes the lid. The opening is off, and the lid simply sits closed, under reduced motion or when the viewport is shorter than 560px.

### The Tray (signature)
The compartmented inside of the box: a green board frame holding photographs in unequal compartments, each carrying its sticker label at the bottom reading-start corner, or a small caption tag (Sticker Stock, 1px rose border, 0.35rem corner, fine type) for a detail photograph.

### Ribbon
On the gift passage a 4rem Seal Rose ribbon (3rem on phones), edged with faint Board Ink hairlines, runs vertically behind the wrapped-tray photograph across the full height of the green section.

## Do's and Don'ts

### Do:
- **Do** alternate sections between Pistachio Board and Rose Tissue; the order of materials tells the visitor whether they are outside or inside the box.
- **Do** put every sweet's name and description on a sticker label with the double rose rule, set within about one degree of straight.
- **Do** set names and headings in Aref Ruqaa 700 and everything read in Readex Pro at 350, with 1.7–1.8 leading.
- **Do** keep Brass Foil to the wordmark and display-size headings on board.
- **Do** show an unconfirmed fact as a labelled blank (dotted fill-in line or placeholder tag), never as an invented value.
- **Do** let the real photographs carry the colour; frame them in die-cut openings and compartments.
- **Do** keep the lid opening scroll-driven and fully disabled under reduced motion.

### Don't:
- **Don't** build the cream-and-burgundy patisserie page: a hero photo over a row of equal product cards.
- **Don't** add drop shadows to stickers, photos, buttons or panels; the lid's lift is the only cast shadow.
- **Don't** round the board itself; only openings and paper pieces have corners.
- **Don't** set body, label or navigation text in Brass Foil or Seal Rose; Deep Rose Ink is for display print and the small placeholder tag on label stock.
- **Don't** set descriptions, lists or fields in Ruqʿah.
- **Don't** rotate photographs, the tray or the window; only labels sit askew.
