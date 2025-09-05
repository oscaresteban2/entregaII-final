const form = document.getElementById("formProductCreator");
const addBtn = document.getElementById("add-btn");

fetch("/api/sessions/current")
  .then((response) => response.json())
  .then((userData) => {
    if (userData.payload.role === "admin") {
      deleteBtn.disabled = false;
      addBtn.disabled = false;
    } else if (userData.payload.role === "premium") {
      deleteBtn.disabled = true;
      addBtn.disabled = false;
    }
  })
  .catch((error) => console.error(error));

if (!form) {
  console.error("Formulario no encontrado");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  // Verifica que todos los campos se estén enviando correctamente
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    console.error("Error en la solicitud:", response.status, await response.text());
    return;
  }

  const result = await response.json();

  if (result.status === "success") {
    Swal.fire({
      title: "Se registró correctamente el producto!",
      icon: "success",
      position: "top-end",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/api/products';
      }
    });
  } else {
    console.log("Hubo un error al crear el producto");
  }
});


const deleteBtn = document.getElementById("delete-btn");
document.getElementById('delete-btn').addEventListener('click', function () {
  const productId = document.getElementById('pid').value;
  DeleteProduct(productId);
});


function DeleteProduct(productId) {
  Swal.fire({
    title: "Confirma si deseas eliminar producto o Actualizar estado?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Actualizar Estado",
    denyButtonText: `Eliminar producto`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch(`/api/products/status/${productId}`, {
        method: 'PUT',
        // Otras configuraciones como headers, body, etc. si son necesarias
      })
        .then(response => {
          if (response.ok) {
            Swal.fire("Producto Actualizado exitosamente!", "", "success");
            // Realiza alguna acción adicional si es necesario, como recargar la página o actualizar la lista de productos
          } else {
            throw new Error('Error al Actualizar el producto');
          }
        })
        .catch(error => {
          console.error('Error al Actualizar el producto:', error.message);
        });

    } else if (result.isDenied) {
      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        // Otras configuraciones como headers, body, etc. si son necesarias
      })
        .then(response => {
          if (response.ok) {
            // Producto eliminado exitosamente
            Swal.fire("Producto eliminado exitosamente", "", "info");
            // Realiza alguna acción adicional si es necesario, como recargar la página o actualizar la lista de productos
          } else {
            throw new Error('Error al eliminar el producto');
          }
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error.message);
          // Manejo de errores: muestra un mensaje de error o realiza alguna acción adicional
        });
    }
  });
}