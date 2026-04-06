# 🌊 Atlantis Swim School - Management Dashboard

O platformă web completă dedicată gestionării programărilor, abonamentelor și rezultatelor pentru o școală de înot. Proiectul oferă interfețe de utilizator moderne și sigure, cu funcționalități dedicate pentru trei roluri distincte: **Elevi**, **Antrenori** și **Administratori**.

## ✨ Funcționalități Principale

### 👨‍🎓 Pentru Elevi
- vizualizarea profilului personal și actualizarea setărilor (ex.: confidențialitate).
- Cumpărarea și reînnoirea abonamentelor (planuri standard, pro, individuale).
- Verificarea orarului și rezervarea ședințelor de antrenament.
- Urmărirea progresului și a rezultatelor personale (ex.: timpi obținuți).
- Sistem de notificări și mesagerie internă cu antrenorii.

### 🏊‍♂️ Pentru Antrenori (Coaches)
- Vizualizarea listei de elevi și accesarea informațiilor lor (medicale/preferințe).
- Marcarea prezenței la antrenamente și evaluarea elevilor.
- Gestionarea propriului orar de lucru (schedule slots).
- Modificarea setărilor de profil.
- Mesagerie cu elevii și administratorul platformei.

### 👑 Pentru Administratori
- O privire de ansamblu a platformei (Dashboard).
- Gestiunea platformei, a încasărilor și a conturilor utilizatorilor.
- Trimiterea de oferte speciale automate direct către utilizatorii activi.
- Modificarea permisiunilor globale (prin sistem de role-based access).

---

## 🛠️ Stack Tehnologic

Acest proiect a fost dezvoltat utilizând cele mai bune practici din ecosistemul tehnologiilor web moderne:

- **Frontend Framework:** [React.js](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v3 (Design modern cu *glassmorphism* și componente adaptabile - dark/light mode)
- **Routing:** [React Router DOM](https://reactrouter.com/) (include *Protected Routes* vizibile per rol).
- **Internationalizare (i18n):** [i18next](https://www.i18next.com/) pentru suportificare interfață (Limbi: 🇷🇴 / 🇬🇧 / 🇷🇺).
- **Iconografie UI:** [Lucide React](https://lucide.dev/icons/)
- **Gestionare State (Context API):** Autentificare (`AuthContext`), Teme vizuale (`ThemeContext`), Coș de cumpărături (`CartContext`), Notificări (`NotificationsContext`).

---

## 🚀 Cum rulezi proiectul local

Dacă dorești să descarci și să rulezi proiectul pe propriul calculator, urmează pașii de mai jos. (Trebuie să ai instalat [Node.js](https://nodejs.org/)).

1. **Clonează repository-ul:**
   ```bash
   git clone <URL_STRUCTURA_PROIECT>
   cd ProiectTweb
   ```

2. **Instalează dependențele referențiate în `package.json`:**
   ```bash
   npm install
   ```

3. **Pornește serverul de dezvoltare:**
   ```bash
   npm run dev
   ```

4. Deschide adresa oferită de terminal în browserul tău, cel mai probabil este situată pe:
   ```
   http://localhost:5173
   ```

---

## 🔑 Conturi Demo (Testare)

Proiectul nu necesită un backend/bază de date pornit separart, deoarece utilizează un set larg de **Mock Data global**. 
Pentru teste sau evaluare, la secțiunea *"Login"* sau *"Connect"* folosiți unul dintre următoarele conturi pre-generate:

| Rol | Nume Reprezentativ | Email | Parolă |
| :--- | :--- | :--- | :--- |
| **Elev** | Andrei Popov | `andrei.popov@student.md` | `elev1234` |
| **Antrenor** | Cătălina Moraru | `catalina@atlantisswim.md` | `antrenor1234` |
| **Admin** | Super Admin | `admin@school.com` | `admin1234` |

*Notă: Nu este necesară introducerea lor manuală - există un buton "Conturi Demo" pe pagina de login care autocomplează automat input-urile pentru ușurință!*

---

## 📂 Structura Arborescentă a Proiectului (Simplified)

```text
src/
├── components/           # Componente generice (PageHeader, Dropdown, Toggle)
│   ├── settings/         # Componentele specifice paginilor de configurări
│   └── ui/               # Widget-uri sau piese de UI complexe 
├── context/              # Context API pentru sistem cross-component (Teme, Utilizatori, Notificări, Cart)
├── data/                 # Seturi extinse de Mock Data incluzând Utilizatori, Abonamente și Rezultate
├── layout/               # Structura site-ului: Sidebar-uri, NavBar-uri, Top Headers, meniuri pe mobil
├── pages/                # Paginile majore ale fiecărei rute
│   ├── coach/            # Paginile destinate exclusiv Antrenorilor
│   ├── student/          # Paginile destinate exclusiv Elevilor
│   └── ...               # Pagini publice și generice de erori (404, 401, 500, etc)
├── types/                # Definiții de typizari TypeScript globale (`index.ts`)
├── App.tsx               # Entry point-ul aplicației de Routing (\`<Routes>\`, protected routes)
└── main.tsx              # Index-ul dinamic unde fișierul principal React este legat de elementul `#root`
```

---

**© 2026 Atlantis Swim School Dashboard Project.** Dezvoltat exclusiv cu scop demonstrativ educațional.