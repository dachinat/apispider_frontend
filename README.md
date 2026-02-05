[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L4L01T5K7F)

# APISpider – Frontend

<h2 align="center">
  <img height="175" src="./public/logo-full.png" alt="APISpider logo">
</h2>

<h3 align="center">
  APISpider frontend application built with Preact, TypeScript, and Vite
</h3>

This repository contains the **frontend application for APISpider**, a lightweight and developer-focused API client.

---

## Tech Stack

- **Preact** `v10.26.9`
- **TypeScript**
- **Vite** `v7.0.4`

---

## Getting Started

### Development

```bash
VITE_API_BASE_URL=http://localhost:8081 npm run dev
```

Starts the dev server at  
👉 http://localhost:5173  
with the API base URL set to `http://localhost:8081`.

### Production Build

```bash
npm run build
```

Builds the app for production and outputs files to `dist/`.  
All discovered routes are prerendered to static HTML.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally at  
👉 http://localhost:4173

---

## Environment Variables

| Variable | Description |
|--------|------------|
| `VITE_API_BASE_URL` | Base URL of the APISpider backend API |

---

## Contributing

Contributions are welcome and appreciated

If you’d like to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Commit your changes (`git commit -m "Add my feature"`)
5. Push to the branch (`git push origin feature/my-feature`)
6. Open a Pull Request

Please try to:
- Follow the existing code style and project structure
- Keep commits focused and descriptive
- Test your changes before submitting

If you’re unsure where to start, feel free to open an issue or discussion.

---

## Support the Project

If you find APISpider useful, consider supporting the project  
[Support on Ko-fi](https://ko-fi.com/L4L01T5K7F)
