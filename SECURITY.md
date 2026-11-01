# Seguridad — La Idea / Archivo Histórico Anarquista

Aplicación React (Vite) sin backend propio. En producción se sirve como sitio
estático en **Cloudflare Workers** (`laidea.antarquia.cl`, desde `main`); `develop`
se publica en beta y GitHub Pages queda como respaldo.

## Cómo reportar

Escribe a **antarquia@riseup.net** con:

- la URL afectada;
- qué ocurre y cómo reproducirlo;
- el navegador y la versión, si aplica.

Si el fallo permite ejecutar código en el navegador de otra persona o acceder a
datos de terceros, no abras un issue público: manda el correo primero.

## Alcance

Entra: XSS, inyección en el contenido, dependencias comprometidas, exposición de
secretos, fallos en el despliegue.

No entra: exactitud del contenido histórico, spam al correo de contacto, ataques
que requieran control del dispositivo de la víctima.

## Medidas vigentes

- **Dependencias de producción auditadas en CI** (`npm audit --omit=dev`); hoy 0
  vulnerabilidades. Las de desarrollo se revisan de forma informativa.
- **Actions fijadas por SHA** y `persist-credentials: false` en el checkout.
- **Dependabot** semanal para npm y GitHub Actions.
- **CodeQL** semanal y en cada push a `main`/`develop`.
- **SBOM** CycloneDX generado en CI.
- El lector embebido usa `referrerPolicy="no-referrer"` y `loading="lazy"`.
- Los secretos (`CLOUDFLARE_API_TOKEN`, `VITE_PDF_BASE`) viven en GitHub
  Actions, nunca en el repositorio.

## Terceros que sí reciben datos

Estos servicios son parte del diseño actual; se documentan para que la decisión
sea explícita:

| Servicio | Qué recibe | Nota |
| --- | --- | --- |
| Google Fonts | IP y User-Agent al cargar tipografías | pendiente: auto-hospedar |
| FormSubmit (`formsubmit.co`) | nombre, correo y mensaje del formulario | decisión de producto pendiente |
| Beacon de analítica propia | ruta visitada (sin cookies) | servidor Tailscale del proyecto |
| Servidor de PDFs | IP al abrir/descargar un PDF | contenedor nginx local vía Tailscale |

Ninguno de estos puntos está bajo la licencia del código; ver [`LICENSE`](LICENSE).
