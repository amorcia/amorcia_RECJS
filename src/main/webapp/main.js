let productos = [
	{ nombre: 'pan', coste: 1.0 },
	{ nombre: 'leche', coste: 1.5 },
	{ nombre: 'huevos', coste: 2.2 }
];//array encargado de guardar los productos

let carrito = [];//array encargado de guardar el carrito
let ivaAplicado = false;

/*
metodo para que al arrancar el index se actualize nuestro desplegable
es decir al cargar la ventana se actualiza los elementos de la tabla
*/
window.onload = () => {
	actualizarDesplegable();
};

// Normalizar nombre (sin caracteres especiales, minúscula)
function normalizarNombre(nombre) {
	return nombre.trim().toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
}

//metodo para añadir un producto
function añadirProducto() {
	const nombreInput = document.getElementById('nombreProducto');
	const costeInput = document.getElementById('costeProducto');

	let nombre = normalizarNombre(nombreInput.value);
	//convertir a float(entero con decimales)
	let coste = parseFloat(costeInput.value);

	if (!nombre) {
		alert("Nombre inválido. No puede estar vacío ni tener caracteres especiales.");
		return;
	}
	if (productos.some(p => p.nombre === nombre)) {
		alert("El producto ya existe.");
		return;
	}
	if (isNaN(coste) || coste <= 0) {
		alert("El coste debe ser un número positivo.");
		return;
	}

	coste = Math.round(coste * 100) / 100;
	productos.push({ nombre, coste });

	actualizarDesplegable();
	nombreInput.value = '';
	costeInput.value = '';
}

/*
metodo para actualizar el desplegable que representa nuestra lista de productos
con sus select en html
*/
function actualizarDesplegable() {
	const seleccion = document.querySelector('select[name="nombre"]');
	seleccion.innerHTML = '<option value="0" id="productos" selected disabled>Elija su producto</option>';
	productos.forEach(p => {
		const opcion = document.createElement('option');
		opcion.value = p.nombre;
		opcion.textContent = `${p.nombre} - ${p.coste.toFixed(2)}€`;
		seleccion.appendChild(opcion);
	});
}

//metodo para añadir productos a la cesta
function añadirACesta() {
	const seleccion = document.querySelector('select[name="nombre"]');
	const cantidadInput = document.querySelector('input[type="number"]:not(#costeProducto)');
	let nombre = seleccion.value;
	let cantidad = parseInt(cantidadInput.value);

	if (!nombre || isNaN(cantidad) || cantidad < 1) {
		alert("Seleccione un producto válido y cantidad mayor que 0.");
		return;
	}

	const producto = productos.find(producto => producto.nombre === nombre);
	if (!producto) return;

	const existente = carrito.find(producto => producto.nombre === nombre);
	if (existente) {
		existente.cantidad += cantidad;
	} else {
		carrito.push({ nombre, cantidad, coste: producto.coste });
	}

	cantidadInput.value = '';
	escribir();
}

//metodo para eliminar productos de la cesta
function eliminarDeCesta() {
	const seleccion = document.querySelector('select[name="nombre"]');
	let nombre = seleccion.value;

	const index = carrito.findIndex(producto => producto.nombre === nombre);
	if (index === -1) {
		alert("El producto no está en el carrito.");
		return;
	}
	carrito.splice(index, 1);
	escribir();
}

//metodo para actualizar nuestra tabla del carrito
function escribir() {
	const tbody = document.getElementById('tabla');
	const span = document.querySelector('tfoot span');
	tbody.innerHTML = '';

	let total = 0;

	carrito.forEach(item => {
		let fila = document.createElement('tr');
		let costeTotal = item.cantidad * item.coste;
		total += costeTotal;

		fila.innerHTML = `
			<td>${item.nombre}</td>
			<td>${item.cantidad}</td>
			<td>${costeTotal.toFixed(2)}€</td>
		`;
		tbody.appendChild(fila);
	});

	span.textContent = total.toFixed(2) + "€";
}

// Aplicar o quitar IVA
function modificarIVA() {
	ivaAplicado = !ivaAplicado;

	productos.forEach(producto => {
		producto.coste = ivaAplicado
			? Math.round(producto.coste * 1.21 * 100) / 100
			: Math.round(producto.coste / 1.21 * 100) / 100;
	});

	// También actualizamos el carrito con los nuevos costes
	carrito.forEach(item => {
		const productoNuevoCoste = productos.find(producto => producto.nombre === item.nombre);
		if (productoNuevoCoste) {
			item.coste = prod.coste;
		}
	});

	alert(ivaAplicado ? "IVA aplicado." : "IVA eliminado.");
	actualizarDesplegable();
	escribir();
}

// Finalizar compra
function finalizarCompra() {
	if (carrito.length === 0) {
		alert("El carrito está vacío.");
		return;
	}

	const confirmacion = prompt("Para confirmar la compra, escriba 'comprar'");
	if (!confirmacion || confirmacion.toLowerCase() !== "comprar") {
		alert("Compra no confirmada.");
		return;
	}

	const dia = new Date();
	dia.setDate(dia.getDate() + 1);
	if (dia.getDay() === 0) {
		dia.setDate(dia.getDate() + 1);
	}
	dia.setHours(12, 0, 0, 0);
	//convertir a string nuestra fecha
	alert("Compra finalizada. Fecha estimada de envío: " + dia.toLocaleString("es-ES"));

	carrito = [];
	escribir();
}
