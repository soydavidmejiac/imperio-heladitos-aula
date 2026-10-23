# Imperio de Heladitos Gourmet — GitHub + Vercel

Aula móvil con ocho videos de YouTube seleccionados, buscador, categorías, favoritos, avance local y acceso mediante una clave compartida validada en el servidor.

## 1. Subir a GitHub

1. Descomprime el ZIP en tu computador.
2. Abre el repositorio de GitHub que vas a usar. Si ya contiene otro sitio, conserva una copia antes de reemplazarlo.
3. Selecciona **Add file → Upload files**.
4. Arrastra el CONTENIDO de la carpeta, conservando las carpetas `app`, `content`, `lib`, `public` y `tests`. `package.json` debe quedar en la raíz del repositorio, no dentro de otra carpeta.
5. Incluye también `.gitignore` y `.env.example` si tu explorador oculta archivos que comienzan por punto.
6. Pulsa **Commit changes**. No subas el ZIP como un único archivo: debes descomprimirlo primero.

Alternativa desde terminal, dentro de la carpeta descomprimida:

```bash
git init
git add .
git commit -m "Aula Imperio de Heladitos lista para Vercel"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

Estos comandos son para un repositorio nuevo/vacío. Si el repositorio ya tiene historial, clónalo y copia los archivos allí; no fuerces el push.

## 2. Configurar el proyecto existente en Vercel

1. Abre el proyecto de Vercel destinado a esta aula.
2. En **Settings → Git**, conecta o verifica el repositorio correcto.
3. En los ajustes de compilación configura:
   - Framework Preset: **Next.js**.
   - Root Directory: la carpeta donde está `package.json` (raíz si subiste todo directamente).
   - Build Command: **npm run build**.
   - Install Command: **npm ci** o el valor automático.
   - Output Directory: deja el valor automático de Next.js; no uses `dist` ni `public`.
   - Node.js: **22.x** o una versión posterior compatible.
4. Si necesitas un proyecto nuevo, utiliza **Add New → Project**, importa el repositorio y aplica los mismos ajustes.

## 3. Configurar la clave de compradores

En **Settings → Environment Variables**, crea estas variables para **Production** y **Preview**:

| Nombre | Qué ingresar |
|---|---|
| `BUYER_ACCESS_CODE` | La clave de compradores que elegiste en la conversación, exactamente igual y respetando mayúsculas. |
| `ACCESS_SESSION_SECRET` | Un valor aleatorio de al menos 32 bytes. Puedes generarlo con el comando de abajo. |

Generar un secreto de sesión en un computador con Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado únicamente en Vercel. No uses el mismo valor que el código de compradores. No agregues el prefijo `NEXT_PUBLIC_` a ninguna de estas variables. El ZIP no incluye tu clave real ni el secreto de sesión.

Si falta una variable, el servidor mantiene el aula bloqueada. Guardarlas no modifica un despliegue ya realizado: debes ejecutar **Redeploy** o subir un nuevo commit.

## 4. Desplegar y comprobar

1. Abre **Deployments** y despliega el último commit o selecciona **Redeploy**.
2. Espera el estado **Ready** y abre el dominio de producción.
3. Prueba en ventana privada: fondo visible y bloqueado, rechazo del código incorrecto, ingreso con el código correcto, reproducción, favoritos, avance y cierre de sesión (círculo **IH**, arriba a la derecha).
4. Prueba también desde tu celular.
5. Si Vercel muestra su propia pantalla de acceso, revisa **Deployment Protection** antes de compartir el dominio con compradores. Esa protección de Vercel es independiente del código de esta aula.

## Desarrollo local

```bash
npm ci
```

Copia `.env.example` a `.env.local`, completa sus dos valores y ejecuta:

```bash
npm run dev
```

Abre `http://localhost:3000`. No abras archivos HTML con doble clic: esta aplicación requiere el servidor para validar el acceso.

```bash
npm test
npm run build
npm start
```

## Archivos principales

- `app/route.js`: sirve la portada con la pantalla de acceso.
- `app/api/access/route.js`: ingreso, estado de sesión y cierre.
- `app/api/classroom.js/route.js`: entrega el código del aula únicamente con una sesión válida.
- `lib/access.js`: validación del código, firma HMAC, cookies y limitación básica de intentos.
- `content/html.js`: HTML del aula y acceso.
- `content/classroom.js`: contenido y funcionamiento de las ocho clases, entregado desde el servidor después del ingreso.
- `public/gate.js`: interfaz de ingreso.
- `public/style.css`: diseño adaptable a celulares.
- `public/assets/imperio.png`: imagen de marca.

## Comportamiento y límites

- La clave es compartida: cualquiera que la conozca puede ingresar. El sistema no verifica pagos ni administra cuentas individuales.
- Con «Recordar mi acceso», la sesión dura hasta 30 días. Sin esa opción, la cookie es de sesión y el token vence a las 12 horas. Usa «Cerrar sesión» en dispositivos compartidos.
- Cambiar el código o el secreto en Vercel y volver a desplegar invalida las sesiones anteriores.
- Las cookies son HttpOnly y SameSite=Strict; en HTTPS también son Secure.
- Hay una limitación básica de ocho fallos por diez minutos e IP en memoria. Es por instancia y no es un límite global persistente; para mayor protección utiliza una política de Vercel Firewall o un almacén compartido.
- El avance y los favoritos se guardan en cada navegador; no se sincronizan entre dispositivos.
- Los videos siguen siendo públicos en YouTube y pertenecen a sus creadores. Se protege el acceso a este portal, no la disponibilidad de esos videos en YouTube.
- El diseño carga las fuentes desde Google Fonts; si no hay conexión, usa una tipografía del sistema.

La exportación no cambia el sitio existente en Sites ni lo publica en Vercel por sí sola.
