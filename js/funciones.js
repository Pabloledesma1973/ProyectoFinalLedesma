// Función para agregar productos al carrito
function agregarAlCarrito(idProducto) {
    fetch("data/productos.json")
        .then(response => response.json())
        .then(productos => {
            const producto = productos.find(p => p.id === idProducto);
            carrito.push(producto);
            actualizarCarrito();
            mostrarMensaje(`Añadiste ${producto.nombre} al carrito`);
        });
}

// Función para mostrar mensajes con SweetAlert2
function mostrarMensaje(mensaje) {
    Swal.fire({
        title: mensaje,
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });
}

// Función para actualizar el contenido del carrito
function actualizarCarrito() {
    const carritoContainer = document.getElementById("carrito");
    const totalContainer = document.getElementById("total");
    carritoContainer.innerHTML = "";

    let total = 0;
    carrito.forEach(producto => {
        const item = document.createElement("li");
        item.classList.add("list-group-item");
        item.textContent = `${producto.nombre} - $${producto.precio}`;
        carritoContainer.appendChild(item);
        total += producto.precio;
    });

    totalContainer.textContent = total;
}

// Función para realizar el pago
function pagar() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío");
        return;
    }

    let resumen = "";
    let total = 0;

    carrito.forEach(producto => {
        resumen += `${producto.nombre} - $${producto.precio}\n`;
        total += producto.precio;
    });

    Swal.fire({
        title: "Resumen de Compra",
        text: `${resumen}\nTotal: $${total}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire("¡Compra realizada!", "Gracias por tu compra", "success");
            carrito.length = 0;
            actualizarCarrito();
        }
    });
}
document.addEventListener("DOMContentLoaded", async () => {
    const productosContainer = document.getElementById("productos");

    try {
        const response = await fetch("productos.json");
        const productos = await response.json();
        
        productos.forEach(producto => {
            const productoCard = document.createElement("div");
            productoCard.classList.add("col-md-4", "mb-4");
            productoCard.innerHTML = `
                <div class="card">
                    <img src="${producto.imagen}" class="card-img-top product-image" alt="${producto.nombre}">
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
// Función para mostrar u ocultar el carrito
function toggleCarrito() {
    const carrito = document.getElementById('carrito');
    carrito.style.display = carrito.style.display === 'none' || carrito.style.display === '' ? 'block' : 'none';
}



// Función para actualizar el contenido del carrito
function actualizarCarrito() {
    const carritoContainer = document.getElementById("carrito");
    const totalContainer = document.getElementById("total");
    carritoContainer.innerHTML = ""; // Limpiamos el carrito

    let total = 0; // Inicializamos el total
    carrito.forEach((producto, index) => {
        const item = document.createElement("li");
        item.classList.add("list-group-item");
        item.textContent = `${producto.nombre} - $${producto.precio}`;

        // Crear botón "Eliminar"
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger", "btn-sm", "float-end");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => confirmarEliminacion(index); // Usamos el índice actual

        item.appendChild(btnEliminar); // Añadir el botón al item
        carritoContainer.appendChild(item); // Añadir el item al carrito
        total += producto.precio; // Sumar al total
    });

    totalContainer.textContent = total; // Actualizamos el total en el DOM
}

// Función para confirmar la eliminación de un producto del carrito
function confirmarEliminacion(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Este producto será eliminado del carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarDelCarrito(index); // Solo eliminamos si el usuario confirma
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado del carrito.', 'success');
        }
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    // Verificamos que el índice esté dentro de los límites del carrito
    if (index > -1 && index < carrito.length) {
        carrito.splice(index, 1); // Eliminamos el producto del array `carrito`
    }
    actualizarCarrito(); // Actualizamos el carrito en el DOM
}


// Función para realizar el pago
function pagar() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío");
        return;
    }

    let resumen = "";
    let total = 0;

    carrito.forEach(producto => {
        resumen += `${producto.nombre} - $${producto.precio}\n`;
        total += producto.precio;
    });

    Swal.fire({
        title: "Selecciona método de pago",
        input: "radio",
        inputOptions: {
            contado: 'Contado',
            credito: 'Crédito'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Debes seleccionar un método de pago';
            }
        }
    }).then((result) => {
        if (result.value === 'contado') {
            // Pago en efectivo, sin verificación adicional
            Swal.fire("¡Compra realizada!", "Gracias por tu compra en efectivo", "success");
            carrito.length = 0;
            actualizarCarrito();
        } else if (result.value === 'credito') {
            // Solicitar los 16 dígitos de la tarjeta
            Swal.fire({
                title: "Ingresa los 16 dígitos de tu tarjeta",
                input: "text",
                inputPlaceholder: "1234 5678 9101 1121",
                inputAttributes: {
                    maxlength: 16,
                    pattern: "\\d*",
                },
                showCancelButton: true,
                confirmButtonText: "Pagar",
                cancelButtonText: "Cancelar",
                inputValidator: (value) => {
                    if (!/^\d{16}$/.test(value)) {
                        return "Número de tarjeta inválido. Deben ser 16 dígitos numéricos.";
                    }
                }
            }).then((cardResult) => {
                if (cardResult.isConfirmed) {
                    Swal.fire("¡Compra realizada!", "Gracias por tu compra con tarjeta de crédito", "success");
                    carrito.length = 0;
                    actualizarCarrito();
                }
            });
        }
    });
}




