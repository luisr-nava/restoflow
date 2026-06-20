<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


<!-- listo vamos con la cocina ahora, el unico problema que cuando quiero hacer el login me dice credenciales invalidas y son correctas pero solo me pasa con la cocina  -->

<!-- TODO SEGURIDAD

Actualmente staff funciona mediante:
- Cookie propia
- Policies anon para restaurant_staff
- Policies anon para orders/payments

Sirve para desarrollo.

Pendiente producción:
- Tabla staff_sessions
- Token aleatorio persistido
- Cookie con token
- Lookup de sesión en DB
- Service role para operaciones sensibles
- Eliminar policies anon amplias -->