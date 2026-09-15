1 -> **HyggeFramework**

HyggeFramework es un framework backend para Node.js diseñado bajo los principios de Clean Architecture, SOLID e Inyección de Dependencias. Ofrece una infraestructura robusta, segura y agnóstica para construir aplicaciones de escala enterprise rápidamente.

---

2 -> **Características Principales**

* **Arquitectura Decoplada:** Separación clara entre capas de Infraestructura (`Lib/`) y Dominio de Aplicación (`App/`).
* **Inyección de Dependencias:** Componentes independientes pasados mediante constructores, facilitando pruebas unitarias y mantenimiento.
* **Persistencia Agnóstica (Multi-Driver):** Adaptador genérico compatible con **SQLite**, **MySQL** y **PostgreSQL** mediante el patrón Data Mapper/Active Record.
* **Seguridad Avanzada:**
  * **Helmet:** Cabeceras HTTP endurecidas.
  * **CORS:** Configuración de orígenes cruzados segura y dinámica.
  * **Rate Limiting:** Protección contra ataques DDoS y de fuerza bruta.
  * **Bcrypt & JWT:** Encriptación de contraseñas y autenticación sin estado.
* **Gestión de Archivos:** Subida y validación de archivos/imágenes mediante `Multer` con servicio estático en `/uploads`.
* **Configuración Segura:** Validación en tiempo de arranque (`EnvValidator`) y centralización inmunizada con `Object.freeze`.
* **Respuesta Estándar y Manejo de Errores:** `BaseController` con métodos fábrica y `ErrorHandler` global centralizado.

---

3 ->  **Patrones de Diseño Aplicados**

* **Layered Architecture / MVC**
* **Data Mapper / Active Record**
* **Singleton** (Conexión de BD)
* **Adapter / Driver Pattern** (Persistencia Multi-motor)
* **Factory Method & Template Method** (BaseController y Respuestas HTTP)
* **Chain of Responsibility** (Middlewares de Express)
* **Dependency Injection**

---

4 -> **Estructura del Proyecto**

HyggeFramework/

├── App/                      # Capa de Dominio / Negocio

│   ├── Controllers/          # Controladores HTTP

│   ├── Middlewares/          # Middlewares específicos de app

│   ├── Routes/               # Definición de rutas

│   ├── Schemas/              # Schemas de validación

│   └── Services/             # Lógica de negocio

├── Lib/                      # Capa de Infraestructura (Reutilizable)

│   ├── Config/               # Env.js y EnvValidator.js

│   ├── Database/             # Connection, Repository, Record

│   ├── Logger/               # Módulo de registros

│   ├── Middleware/           # ErrorHandler, Security, Auth, Validation

│   └── Storage/              # Uploader (Multer Wrapper)

├── public/

│   └── uploads/              # Almacenamiento de archivos estáticos

├── .env.example              # Plantilla de variables de entorno

├── app.js                    # Bootstrap y punto de entrada

└── package.json

5 -> **Instalación y Configuración**

git clone https://github.com/Joseph-R-S/hyggeframework.git
cd hyggeframework
npm install

6 -> **Configurar variables de entorno**
Copia el archivo de ejemplo .env.example a .env:

cp .env.example .env

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

7 - > **Ejecución**

Modo Desarrollo -> npm run dev
Modo Producción -> npm start

8 -> **Licencia**

Distribuido bajo la licencia ISC.
