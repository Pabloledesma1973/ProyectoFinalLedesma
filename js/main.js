document.addEventListener("DOMContentLoaded", async () => {
    const productosContainer = document.getElementById("productos");

    try {
        const response = await fetch("data/productos.json");
        const productos = await response.json();
        productos.forEach(producto => {
            const productoCard = document.createElement("div");
            productoCard.classList.add("col-md-4", "mb-4");
            productoCard.innerHTML = `
                <div class="card">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: $${producto.precio}</p>
                        <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
                    </div>
                </div>
            `;
            productosContainer.appendChild(productoCard);
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
});

// Carrito de compras
const carrito = [];

