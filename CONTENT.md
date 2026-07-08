# Manchester Medical Centre — website owner's guide

This is a fast, static website (plain HTML/CSS/JS — no build step). It works on
any static host, including **GitHub Pages**. This guide lists everything you
should personalise, and how to switch on online booking.

---

## 1. The one place to edit your contact details

Open **`assets/js/main.js`** and edit the `SITE` block at the very top. These
values fill in automatically across **every page** (header, footer, buttons,
WhatsApp links, contact page):

| Setting | What it is |
|---|---|
| `phoneDisplay` | Your phone number as it should read on screen, e.g. `033 555 1234` |
| `phoneDial` | The same number for tap-to-call, international format, e.g. `+27335551234` |
| `whatsapp` | Your WhatsApp number, digits only, no `+`, e.g. `27825551234` |
| `email` | Your reception email address |
| `calLinks` | Your Cal.com booking links — see section 3 |
| `formspreeId` | (Optional) a Formspree form ID to make the contact form email you |

You do **not** need to edit the phone/email/WhatsApp anywhere else — just here.

---

## 2. Text placeholders to replace

Search the project for the word **`REPLACE`** — every spot that needs your real
details is marked with an HTML comment `<!-- REPLACE: ... -->` right next to it.
The main ones:

- **Practitioner names & qualifications** — in `team.html`, `optometry.html`,
  `dentistry.html`, `physiotherapy.html`. (The physiotherapist, *Ms N Paruk*, is
  already filled in; the optometrist and dentist names are placeholders.)
- **HPCSA registration numbers** — the "HPCSA no. — to confirm" badges on the
  practitioner cards.
- **Practice number** — in the footer of every page (`Practice no. 0000000`).
- **Opening hours** — currently set to a common South African pattern
  (`Mon–Fri 08h00–17h00 · Sat 08h30–13h00 · Sun & public holidays closed`).
  Adjust in `contact.html` (the hours table) and in each page's footer/info strip
  if your hours differ.
- **Medical-aid list** — shown on the home page and footers. Trim or add schemes
  to match those you're contracted to.
- **POPIA notice** — `privacy.html` is a plain-language template. Please review it
  with your Information Officer (and ideally a legal adviser) and fill in the
  bracketed details before relying on it.

### Address (already correct)
The address is set throughout to **Manchester Mall, 14 Manchester Road, Rosedale,
Pietermaritzburg, 3201**. If you have a specific shop/suite number, add it in the
address lines (search for "14 Manchester Road").

---

## 3. Switch on online booking (Cal.com)

The booking page (`book.html`) is built around **Cal.com**. It has three tabs —
Eye Care, Dental, Physiotherapy — each opening its own Cal.com calendar.

To connect it:

1. Create a free account at **cal.com** and set up an **event type** for each
   practice (e.g. "Eye Test", "Dental Visit", "Physiotherapy").
2. Copy each event's link. The part you need is the bit after `cal.com/`, e.g.
   for `https://cal.com/new-sight/eye-test` you use `new-sight/eye-test`.
3. Open **`assets/js/main.js`** and paste them into `calLinks`:

   ```js
   calLinks: {
     optometry:     'new-sight/eye-test',
     dentistry:     'the-smile-clinic/dental',
     physiotherapy: 'n-paruk/physio',
   },
   ```

That's it — the live calendar replaces the "being connected" fallback
automatically. Until you add real links, visitors see a tidy fallback inviting
them to call or WhatsApp, so the page is never broken.

> The Cal.com calendar loads from Cal's servers in the visitor's browser, so it
> needs a normal internet connection to display — this works on the live site.

---

## 4. Add your photos

Right now every image area shows a neat placeholder marked with a caption like
"Photo: reception". To use real photos:

1. Put your image files in the **`assets/img/`** folder (see the README there for
   suggested names and sizes).
2. In the page, find the matching `<!-- REPLACE PHOTO: ... -->` comment. Replace
   the `<div class="photo-slot" ...>…</div>` with an image, for example:

   ```html
   <img src="assets/img/reception.jpg" alt="Manchester Medical Centre reception"
        style="width:100%;height:100%;object-fit:cover" />
   ```

Keep the surrounding container (e.g. `.hero-photo`, `.media-frame`, `.team-photo`)
so the sizing and rounded corners stay the same.

---

## 5. Contact form (optional)

The contact form works out of the box by opening the visitor's email app with a
pre-filled message. To receive submissions as email instead, create a free form
at **formspree.io**, copy its form ID (e.g. `xldpwkgv`), and paste it into
`formspreeId` in `assets/js/main.js`.

---

## 6. Put it online (GitHub Pages)

1. Push these files to your GitHub repository (they're already at the repo root).
2. On GitHub, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source: Deploy from a branch**, choose your
   branch and the **/(root)** folder, and save.
4. After a minute your site is live at `https://<your-username>.github.io/<repo>/`.

To use your own domain (e.g. `manchestermedical.co.za`), add it under
Settings → Pages → Custom domain and point your DNS at GitHub Pages.

---

## Pages at a glance

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About the centre |
| `optometry.html` | Eye Care — New Sight Optometry |
| `dentistry.html` | Dental — The Smile Clinic Dentistry |
| `physiotherapy.html` | Physiotherapy — Ms N Paruk |
| `team.html` | Our team |
| `contact.html` | Contact + enquiry form + map |
| `book.html` | Online booking (Cal.com) |
| `privacy.html` | POPIA privacy notice |

Design system: `assets/css/styles.css` · Behaviour: `assets/js/main.js`
