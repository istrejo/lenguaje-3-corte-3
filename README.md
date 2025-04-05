# Tasks & Users API

![Node.js](https://nodejs.org/en)
![Express](https://expressjs.com/)
![PostgreSQL](https://www.postgresql.org/)

Una API RESTful para gestión de usuarios y tareas, construida con Node.js, Express y PostgreSQL.

## 📊 Esquema de la Base de Datos

### Tabla `users`

| Campo        | Tipo         | Restricciones             |
| ------------ | ------------ | ------------------------- |
| `id`         | SERIAL       | PRIMARY KEY               |
| `name`       | VARCHAR(50)  | NOT NULL                  |
| `email`      | VARCHAR(100) | UNIQUE, NOT NULL          |
| `created_at` | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### Tabla `tasks`

| Campo         | Tipo         | Restricciones                            |
| ------------- | ------------ | ---------------------------------------- |
| `id`          | SERIAL       | PRIMARY KEY                              |
| `title`       | VARCHAR(100) | NOT NULL                                 |
| `description` | TEXT         |                                          |
| `status`      | VARCHAR(20)  | DEFAULT 'pending' (pending/completed)    |
| `user_id`     | INT          | FOREIGN KEY, NOT NULL, ON DELETE CASCADE |

## 🚀 Instalación y Configuración

### Requisitos previos

- Node.js v18+
- PostgreSQL 15+
- npm 9+

### Pasos para configurar

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tasks-api.git
   cd tasks-api

   ```

2 **Intalar dependencias**

    npm install

3 **Configurar variables de entorno**

    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=nombre_de_db
    DB_PASSWORD=tu_contraseña
    DB_PORT=5432
    PORT=3000
