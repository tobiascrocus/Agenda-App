# 📅 AgendaApp

Aplicación móvil desarrollada en **React Native con Expo** para la **gestión de tareas y categorías**, con persistencia de datos local mediante **SQLite**.

El proyecto implementa un **CRUD completo** que permite organizar tareas por categorías, marcar tareas como completadas y visualizar estadísticas por categoría.

---

## 📌 Descripción

La aplicación permite administrar:

* Categorías de tareas
* Tareas asociadas a una categoría
* Estado de completado de cada tarea

Desde la interfaz se pueden realizar operaciones de **alta, modificación, eliminación y consulta**, con persistencia local utilizando **SQLite**.

---

## 🧱 Estructura del proyecto

La aplicación está organizada separando la interfaz de usuario del acceso a datos.

```
Agenda-App/
├── screenshots/
├── AgendaApp/
│   ├── screens/
│   ├── services/
│   ├── assets/
│   ├── App.js
│   ├── package.json
│   └── ...
└── README.md
```

### 📱 Screens

Contiene las pantallas principales de la aplicación:

* `Inicio.js`: pantalla principal con acceso a tareas, categorías y estadísticas.
* `Tareas.js`: gestión completa de tareas.
* `Categorias.js`: gestión de categorías con validaciones.

---

### 🗄️ Services

* `services/db.js`

Encargado de:

* Inicializar la base de datos SQLite
* Crear las tablas necesarias
* Implementar operaciones CRUD
* Ejecutar consultas para estadísticas

La lógica de acceso a datos se encuentra separada de la interfaz para mejorar la mantenibilidad.

---

## 🗄️ Base de datos

La aplicación utiliza **SQLite local**, por lo que no requiere backend ni conexión a internet.

Entidades principales:

### Categorías

* id
* nombre

### Tareas

* id
* titulo
* descripcion
* completada
* categoriaId

Las tareas se encuentran asociadas a una categoría mediante una relación **uno a muchos**.

---

## ⚙️ Funcionalidades principales

* Alta, edición y eliminación de **categorías**
* Alta, edición y eliminación de **tareas**
* Asociación de tareas a categorías
* Marcado de tareas como **completadas**
* Visualización de **estadísticas por categoría**
* Validaciones para evitar eliminar categorías en uso
* Persistencia local mediante **SQLite**

---

## 🛠 Tecnologías utilizadas

* **React Native**
* **Expo**
* **JavaScript (ES6+)**
* **Expo SQLite**
* **Git / GitHub**

---

## 📸 Capturas de pantalla

### Pantalla de inicio

<img src="https://github.com/user-attachments/assets/07530b2c-df53-40d2-8da5-0e75ae1102fe" width="300" />

### Gestión de categorías

<img src="https://github.com/user-attachments/assets/6e7a7615-ece6-472c-beb8-5dbfe8c49ffe" width="300" />

### Gestión de tareas

<img src="https://github.com/user-attachments/assets/d6398aef-fec3-440c-bc70-5a2eec1ee374" width="300" />

---

## ▶️ Ejecución

1. Clonar el repositorio:

```
git clone https://github.com/tobiascrocus/Agenda-App.git
```

2. Ingresar a la carpeta de la aplicación:

```
cd Agenda-App/AgendaApp
```

3. Instalar dependencias:

```
npm install
```

4. Ejecutar la aplicación:

```
npx expo start
```

5. Escanear el código QR utilizando **Expo Go** en un dispositivo **Android o iOS**.

---

## 📝 Notas

* Proyecto desarrollado con fines académicos y de práctica.
