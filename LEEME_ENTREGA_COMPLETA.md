# Brupolo Store: actualización para la entrega completa

Preparado sobre el repositorio daviidsilva23005/brupolo-store-react, commit 573229a.
Este paquete contiene SOLO los cambios, no otro proyecto separado. No incluye node_modules ni dist.
Conservá una copia de tu carpeta antes de fusionar los cambios.

## Qué implementa

| Requisito de la consigna | Implementación |
| --- | --- |
| Listado y detalle de productos | Se mantienen los componentes existentes |
| Carrito con contexto y vista | Se conserva el carrito que ya funcionaba |
| Alta de productos | Formulario existente dentro de /admin protegido |
| Productos en tiempo real | onSnapshot en catálogo y detalle, con cancelación del listener |
| Ruta /admin en producción | Se conserva vercel.json del repositorio |
| PublicLayout y AdminLayout | Nuevos componentes en src/layouts |
| Login del administrador | /login con Firebase Authentication |
| AuthContext | AuthProvider global con onAuthStateChanged, login y logout |
| ProtectedRoute | Espera restauración, redirige sin sesión y rechaza usuarios sin permiso |
| Cuenta para evaluación | UID KrPPsyyWz0ZovPcPRc7gWB5D5GI2 autorizado junto al propietario |

No se añadió dashboard porque es opcional. Tampoco edición/eliminación de productos ni órdenes.
La carga de fotos con ImgBB sigue siendo la actualización separada pendiente de activación;
esta consigna no exige explícitamente un proveedor de imágenes. El formulario usa URL/ruta.

## 1. Aplicar en tu carpeta original

1. Extraé este ZIP en una carpeta aparte.
2. Copiá las carpetas src y tests, y los archivos package.json, package-lock.json,
   firestore.rules y vitest.config.js dentro de:
   C:\Users\davii\OneDrive\Escritorio\brupolo-store-react
3. Si Windows pregunta, fusioná las carpetas y reemplazá los archivos.
   NO borres tu src completo: el paquete solo contiene los archivos que cambian.
4. Abrí la carpeta original en Visual Studio Code.
5. En una terminal nueva ejecutá, uno por uno:

```powershell
npm.cmd install
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

El último comando mantiene la página local funcionando. Abrí la dirección Local que muestre Vite.

## 2. Publicar las reglas en Firebase

La cuenta de la profe debe existir en Firebase Authentication:
Correo admin@admin.com, contraseña admin123.
El UID que nos pasaste para ella es KrPPsyyWz0ZovPcPRc7gWB5D5GI2.
Tu cuenta original vfSjIsLcnYU0BQJDgq7d3bhxiL93 mantiene acceso.

1. Abrí firestore.rules en Visual Studio Code y copiá todo.
2. Firebase Console → Brupolo Store → Firestore → Reglas.
3. Reemplazá el código de la consola por el del archivo.
4. Tocá Publicar. Guardar el archivo local no publica las reglas.

No es necesario crear otra base, mover productos ni abrir permisos a cualquier usuario.
Los productos se pueden leer públicamente; las escrituras se limitan a las dos cuentas.

## 3. Comprobar como lo verá la profe

1. Abrí la tienda local en una ventana de incógnito.
2. Entrá directamente a /admin. Debe redirigir a /login.
3. Ingresá admin@admin.com y admin123. Debe aparecer el layout de administración,
   distinto de la tienda, con botón Cerrar sesión y el formulario de alta.
4. Guardá un producto de prueba completo. Para la imagen podés usar /img/case iphone.webp.
5. Debe aparecer la confirmación y su ID. El enlace Ver producto abre el detalle público.
6. Abrí Inicio en otra pestaña antes de guardar otro producto. Al guardarlo desde el panel,
   debe aparecer en la pestaña pública sin recargar.
7. Para probar el listener del detalle, abrí el detalle de un producto y cambiá su título
   desde Firebase Console. El detalle abierto debe actualizarse sin recargar.
8. Cerrá sesión. Volver a /admin debe pedir iniciar sesión otra vez.
9. Probá que tu cuenta original también tenga acceso.

No uses Cargar los 6 productos iniciales para probar un alta nueva: conserva los IDs existentes.
Los productos de prueba se pueden borrar desde Firebase Console → Datos si hace falta.

## 4. Publicar los cambios

Una vez completadas las pruebas locales:

```powershell
git add src tests package.json package-lock.json firestore.rules vitest.config.js
git commit -m "Completar layouts, AuthContext, rutas protegidas y Firebase en tiempo real"
git push origin main
```

Esperá a que Vercel marque el despliegue como Ready y verificá en incógnito:
https://brupolo-store-react.vercel.app/admin
Debe abrir el login, no un 404. Ingresá con la cuenta de evaluación y repetí la prueba de alta.

Los enlaces de entrega siguen siendo:
Sitio: https://brupolo-store-react.vercel.app/
Código: https://github.com/daviidsilva23005/brupolo-store-react
Indicá también las credenciales de evaluación que pidió la profe.

## Validación realizada antes de entregar este paquete

- npm test: 11 pruebas aprobadas con Firebase simulado.
- npm run build: compilación de producción correcta.
- git diff --check: sin errores de formato.
- Casos: espera de sesión, redirección al login, rechazo de una cuenta no autorizada,
  acceso autorizado, restauración/cierre de sesión, login con credenciales ingresadas,
  retorno a ruta privada y actualización/error/limpieza de listeners del catálogo y detalle.

Las pruebas automatizadas no ingresan a tu Firebase real ni publican nada.
Falta aplicar el paquete en tu computadora, publicar reglas y verificar la cuenta de evaluación
con tu Firebase y el sitio público. No se garantiza una calificación: este mapeo se basa
exclusivamente en la consigna que compartiste.
