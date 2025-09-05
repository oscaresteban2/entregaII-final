document.addEventListener('DOMContentLoaded', () => {
    showButtonCart();

    const btn = document.querySelector('.btn-add-to-cart');

    if (btn) {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.id;
            const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
            updateProductQuatity(productId, quantity);
        });
    }
});

async function addToCart(pid) {
    let cartId = limpiarComillas(localStorage.getItem('cartId'));

    // Si no existe carrito, lo crea
    if (!cartId) {
        try {
            const res = await fetch('/api/carts', { method: 'POST' });
            const data = await res.json();

            if (data.status === 'error') {
                return alert("❌ No se pudo crear el carrito: " + data.message);
            }

            cartId = data.payload._id;
            localStorage.setItem('cartId', cartId);
        } catch (error) {
            return alert("❌ Error al crear el carrito.");
        }
    }

    // Agrega el producto al carrito
    try {
        const res = await fetch(`/api/carts/${cartId}/product/${pid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await res.json();

        if (result.status === 'error') {
            return alert("❌ Error: " + result.message);
        }

        showButtonCart();
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "✅ Producto agregado o actualizado en el carrito",
            showConfirmButton: false,
            timer: 500
        });
    } catch (err) {
        console.error("❌ Error al agregar producto:", err);
        alert("❌ No se pudo agregar el producto.");
    }
}

async function updateProductQuatity(pid, quantity) {
    let cartId = limpiarComillas(localStorage.getItem('cartId'));

    try {
        const res = await fetch(`/api/carts/${cartId}/product/${pid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: quantity })
        });

        const result = await res.json();

        if (result.status === 'error') {
            return alert("❌ Error: " + result.message);
        }

        showButtonCart();
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "✅ actualizado en el carrito",
            showConfirmButton: false,
            timer: 500
        });
    } catch (err) {
        console.error("❌ Error al agregar producto:", err);
        alert("❌ No se pudo agregar el producto.");
    }

}

async function updateQuantity(productId, change) {
    let cartId = limpiarComillas(localStorage.getItem('cartId'));

    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change }) // ejemplo: { change: +1 } o { change: -1 }
    });

    const result = await response.json();   

    if (result.status === 'success') {
        location.reload();
        // const span = document.getElementById(`quantity-${productId}`);
        // span.textContent = result.payload.newQuantity;
    } else {
        alert(result.message);
    }
}

function showButtonCart() {
    const cartId = limpiarComillas(localStorage.getItem('cartId'));

    if (cartId) {
        const btnCart = document.querySelector('#button-cart');
        const viewCartSection = document.querySelector('.view-cart');

        if (btnCart) btnCart.setAttribute("href", `/cart/${cartId}`);
        if (viewCartSection) viewCartSection.style.display = "block";
    }
}

// Función para limpiar comillas dobles (por si vienen del value con "")
function limpiarComillas(valor) {
    if (!valor) return null;
    return valor.replace(/^"+|"+$/g, '');
}

document.addEventListener('DOMContentLoaded', () => {
    const btnDelete = document.querySelectorAll('.btn-delete-in-cart');

    btnDelete.forEach(button => {
        button.addEventListener("click", async () => {
            const productId = button.getAttribute("data-id");
            const cartId = limpiarComillas(localStorage.getItem('cartId'));

            try {
                const response = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    // Elimina el producto del DOM o recarga la página
                    location.reload();
                } else {
                    const error = await response.json();
                    console.error("Error al eliminar el producto:", error.message);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const btnDelete = document.querySelectorAll('.btn-deleteAll');
    btnDelete.forEach(button => {
        button.addEventListener("click", async () => {
            const cartId = limpiarComillas(localStorage.getItem('cartId'));
            try {
                const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    // Elimina el producto del DOM o recarga la página
                    location.reload();
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        })
    })
})