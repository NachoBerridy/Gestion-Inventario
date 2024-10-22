# Gestor de inventario

Este proyecto es un gestor de inventario que permite a los usuarios llevar un control de los productos que tienen en su inventario, así como también permite a los usuarios llevar un control de los productos que han vendido. En el marco de la clase de Investigación operativa, se busca implementar distintos métodos de optimización para mejorar la eficiencia del sistema.

# Tecnologías

![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white)

# Equipo

- [Antonella Aldao]()
- [Facundo Lucero]()
- [Facundo ]()
- [Ignacio Berridy]()

# Diagrama de clases

```mermaid
erDiagram
    Proveedor {
        integer id PK
        text nombre
        text correo
        text telefono
        text direccion
    }
    Articulo {
        integer id PK
        text nombre
        integer stock
        integer stock_seguridad
        integer punto_pedido
        integer lote_optimo
        float tasa_rotacion
        text modelo_inventario
        integer proveedor_id FK
    }
    Venta {
        integer id PK
        integer articulo_id FK
        text fecha
        integer precio
        integer cantidad
    }
    Prediccion_Demanda {
        integer id PK
        integer articulo_id FK
        text periodo
        integer cantidad
        text metodo
    }
    Articulo_Precio_Venta {
        integer id PK
        integer articulo_id FK
        float precio
        text fecha_inicio
        text fecha_fin
    }
    Articulo_Proveedor {
        integer id PK
        integer plazo_entrega
        integer articulo_id FK
        integer proveedor_id FK
        float costo_pedido
    }
    Precio {
        integer id PK
        integer articulo_proveedor_id FK
        float precio_unidad
        integer cantidad_min
        integer cantidad_max
        text fecha_inicio
        text fecha_fin
    }
    Historial_Calculo {
        integer id PK
        integer articulo_proveedor_id FK
        text tipo_inventario
        integer lote_optimo
        integer punto_optimo
        integer stock_seguridad
        text fecha
        integer demanda
    }
    Orden_Compra {
        integer id PK
        integer articulo_proveedor_id FK
        integer cantidad
        integer total
    }
    Orden_Compra_Estado {
        integer id PK
        integer orden_compra_id FK
        text estado
        text fecha
    }
    Configuracion {
        integer id PK
        text valor
    }

    Proveedor ||--o{ Articulo: "provee"
    Articulo ||--o{ Venta: "se vende en"
    Articulo ||--o{ Prediccion_Demanda: "tiene predicciones"
    Articulo ||--o{ Articulo_Precio_Venta: "tiene precios de venta"
    Articulo ||--o{ Articulo_Proveedor: "se provee por"
    Articulo_Proveedor ||--o{ Precio: "tiene precios"
    Articulo_Proveedor ||--o{ Historial_Calculo: "tiene historial de cálculos"
    Articulo_Proveedor ||--o{ Orden_Compra: "se ordena en"
    Orden_Compra ||--o{ Orden_Compra_Estado: "tiene estados"
```

## Instrucciones de uso

Primero, clona el repositorio:

```bash
git clone https://github.com/NachoBerridy/Gestion-Inventario.git
```

Instala las dependencias:

```bash
cd Gestion-Inventario
npm install
# or
yarn install
# or
pnpm install
```

Luego, corre el servidor de desarrollo:


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
