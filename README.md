# 📅 AgendaApp

Aplicación móvil desarrollada con **React Native y Expo** para la gestión eficiente de tareas y categorías, con persistencia de datos local mediante **SQLite**.

El proyecto implementa un **CRUD completo** que permite organizar tus actividades diarias, realizar un seguimiento de cumplimiento y visualizar estadísticas de progreso.

---

## 📸 Capturas de Pantalla

| Inicio y Estadísticas | Gestión de Tareas | Categorías |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/07530b2c-df53-40d2-8da5-0e75ae1102fe" width="220" /> | <img src="https://github.com/user-attachments/assets/d6398aef-fec3-440c-bc70-5a2eec1ee374" width="220" /> | <img src="https://github.com/user-attachments/assets/6e7a7615-ece6-472c-beb8-5dbfe8c49ffe" width="220" /> |

---

## ✨ Funcionalidades Principales

* **Organización por Categorías:** Creación, edición y eliminación de categorías personalizadas.
* **Gestión de Tareas:** CRUD completo de tareas asociadas a categorías específicas.
* **Seguimiento:** Marcado de tareas completadas en tiempo real.
* **Estadísticas Visuales:** Gráficos de barras que muestran el porcentaje de cumplimiento por categoría.
* **Persistencia Local:** Almacenamiento seguro en el dispositivo mediante SQLite (funciona sin internet).
* **Seguridad de Datos:** Validaciones para evitar la eliminación de categorías que aún tienen tareas asociadas.

---

## 🗄️ Arquitectura y Base de Datos

La aplicación sigue una separación de responsabilidades: la interfaz (`screens/`) se comunica con un servicio centralizado de datos (`services/db.js`).

### Modelo de Datos (SQLite)

La estructura se basa en una relación **uno a muchos** (1:N):

* **Categorías:** `id`, `nombre`.
* **Tareas:** `id`, `titulo`, `descripcion`, `completada`, `categoriaId` (FK).

### 📁 Estructura del Proyecto

```
Agenda-App/
├── screens/           # Pantallas principales (Inicio, Tareas, Categorías)
├── services/          # Lógica de base de datos (db.js con SQLite)
├── assets/            # Recursos estáticos (iconos, splash)
├── App.js             # Punto de entrada y navegación
├── package.json       # Dependencias
└── app.json           # Configuración de Expo
```

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/) (SDK 54).
* **Navegación:** React Navigation (Stack).
* **Base de Datos:** `expo-sqlite` para persistencia local.
* **UI & Gráficos:** `react-native-chart-kit`, `react-native-svg` y Material Icons.

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tobiascrocus/Agenda-App.git
   ```

2. **Entrar a la carpeta del proyecto:**
   ```bash
   cd Agenda-App/AgendaApp
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Iniciar Expo:**
   ```bash
   npx expo start
   ```

5. Escaneá el código QR con la app **Expo Go** en tu celular.

---

### 💡 Nota

Proyecto desarrollado con fines académicos y de práctica.
