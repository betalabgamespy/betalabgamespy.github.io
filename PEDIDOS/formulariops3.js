// Variable global para el carrito
let carrito = [];

// Función para obtener los datos del CARRITO
function obtenerDatosCarrito() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// FUNCIÓN VACIAR CARRITO
function vaciarCarrito() {
    sessionStorage.removeItem('carrito');
    carrito = [];
    mostrarResumenCarrito([]);
    actualizarMontoTransferencia('0 Gs');
    
    const tituloElement = document.getElementById('nombreJuego');
    if (tituloElement) {
        tituloElement.textContent = 'Carrito vacío';
    }
    
    alert('✅ Carrito vaciado correctamente');
}

// FUNCIÓN para formatear números
function formatearNumeroConCeros(numero) {
    if (numero === 0) return '0';
    if (Number.isInteger(numero) && numero < 1000) {
        return numero + '.000';
    }
    let numeroString = numero.toString();
    if (!numeroString.includes('.') && numero < 1000000) {
        const partes = numeroString.split('.');
        const parteEntera = partes[0];
        if (parseInt(parteEntera) < 1000) {
            return numero + '.000';
        }
    }
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// FUNCIÓN para calcular precios
function calcularPrecios(item) {
    let precioString = item.precio ? item.precio.toString() : '0';
    precioString = precioString
        .replace(/\s?Gs\s?/g, '')
        .replace(/\$/g, '')
        .replace(/\./g, '')
        .trim();
    
    const precioNumerico = parseFloat(precioString) || 0;
    const subtotalNumerico = precioNumerico * item.cantidad;
    
    const precioMostrar = formatearNumeroConCeros(precioNumerico) + ' Gs';
    const subtotalMostrar = formatearNumeroConCeros(subtotalNumerico) + ' Gs';
    
    return {
        precioMostrar: precioMostrar,
        subtotalMostrar: subtotalMostrar
    };
}

// Función para mostrar el resumen del carrito
function mostrarResumenCarrito(carrito) {
    const tituloElement = document.getElementById('nombreJuego');
    const contenedorResumen = document.getElementById('resumen-carrito');
    
    if (!carrito || carrito.length === 0) {
        if (tituloElement) {
            tituloElement.textContent = 'Carrito vacío';
        }
        if (contenedorResumen) {
            contenedorResumen.innerHTML = `
                <div class="resumen-pedido">
                    <p class="carrito-vacio">No hay juegos en el carrito</p>
                    <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()" style="opacity: 0.6; cursor: not-allowed;" disabled>
                        🗑️ Vaciar Carrito (carrito vacío)
                    </button>
                </div>
            `;
        }
        return;
    }
    
    const totalJuegos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (tituloElement) {
        tituloElement.textContent = `Pedido de ${totalJuegos} juego(s)`;
    }
    
    let htmlResumen = '<div class="resumen-pedido">';
    htmlResumen += '<h4>📋 Detalles de tu pedido:</h4>';
    htmlResumen += '<div class="lista-juegos">';
    
    carrito.forEach((item, index) => {
        const precios = calcularPrecios(item);
        htmlResumen += `
            <div class="item-resumen">
                <div class="info-juego-item">
                    <span class="nombre-juego">${item.nombre || 'Juego sin nombre'}</span>
                    <span class="precio-juego">${precios.precioMostrar} x ${item.cantidad}</span>
                </div>
                <div class="subtotal-juego">Subtotal: ${precios.subtotalMostrar}</div>
            </div>
        `;
    });
    
    const total = calcularTotalCarrito(carrito);
    const totalMostrar = formatearNumeroConCeros(total) + ' Gs';
    
    htmlResumen += `
        </div>
        <hr>
        <div class="total-pedido">
            <strong>💰 Total a pagar: ${totalMostrar}</strong>
        </div>
        <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()" id="btnVaciarCarrito">
            🗑️ Vaciar Carrito
        </button>
    </div>`;
    
    if (contenedorResumen) {
        contenedorResumen.innerHTML = htmlResumen;
    }
}

// FUNCIÓN para calcular total del carrito
function calcularTotalCarrito(carrito) {
    let total = 0;
    carrito.forEach(item => {
        let precioString = item.precio ? item.precio.toString() : '0';
        precioString = precioString
            .replace(/\s?Gs\s?/g, '')
            .replace(/\$/g, '')
            .replace(/\./g, '')
            .trim();
        const precioNumerico = parseFloat(precioString) || 0;
        const subtotal = precioNumerico * item.cantidad;
        total += subtotal;
    });
    return total;
}

// FUNCIÓN DE PRUEBA PARA VERIFICAR
function probarFormulario() {
    console.log("🔍 PROBANDO FORMULARIO...");
    
    // Verificar si los elementos del formulario existen
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    
    console.log("Elementos del formulario:", {
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        email: email
    });
    
    // Verificar carrito
    const carrito = obtenerDatosCarrito();
    console.log("Carrito actual:", carrito);
    
    alert("✅ Función de prueba ejecutada - Revisa la consola (F12)");
}

// FUNCIÓN SIMPLE PARA ENVIAR A GMAIL (PARA PS3)
function enviarAGmailPS3(event) {
    if (event) {
        event.preventDefault();
    }
    
    console.log("🎯 FUNCIÓN enviarAGmailPS3 EJECUTADA");
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    
    // Verificar si los elementos existen
    if (!nombre || !apellido || !telefono || !email) {
        alert('❌ Error: No se encontraron los campos del formulario');
        console.error("Elementos no encontrados:", {nombre, apellido, telefono, email});
        return false;
    }
    
    const nombreValor = nombre.value;
    const apellidoValor = apellido.value;
    const telefonoValor = telefono.value;
    const emailValor = email.value;
    const mensajeValor = mensaje ? mensaje.value : '';
    
    // Validar campos obligatorios
    if (!nombreValor || !apellidoValor || !telefonoValor || !emailValor) {
        alert('❌ Por favor completa todos los campos obligatorios');
        return false;
    }
    
    // Obtener carrito
    const carrito = obtenerDatosCarrito();
    console.log("Carrito obtenido:", carrito);
    
    // Verificar si el carrito está vacío
    if (!carrito || carrito.length === 0) {
        alert('❌ El carrito está vacío. Agrega juegos antes de enviar el pedido.');
        return false;
    }
    
    const total = calcularTotalCarrito(carrito);
    const totalFormateado = formatearNumeroConCeros(total) + ' Gs';
    
    // Crear mensaje para Gmail
    let cuerpoMensaje = `NUEVO PEDIDO PS3 - BETALAB GAMES PY\n\n`;
    cuerpoMensaje += `INFORMACIÓN DEL CLIENTE:\n`;
    cuerpoMensaje += `Nombre: ${nombreValor} ${apellidoValor}\n`;
    cuerpoMensaje += `Email: ${emailValor}\n`;
    cuerpoMensaje += `Teléfono: ${telefonoValor}\n`;
    cuerpoMensaje += `Mensaje: ${mensajeValor || 'No especificado'}\n\n`;
    
    cuerpoMensaje += `DETALLES DEL PEDIDO:\n`;
    carrito.forEach((item, index) => {
        const precios = calcularPrecios(item);
        cuerpoMensaje += `${index + 1}. ${item.nombre}\n`;
        cuerpoMensaje += `   Cantidad: ${item.cantidad} x ${precios.precioMostrar}\n`;
        cuerpoMensaje += `   Subtotal: ${precios.subtotalMostrar}\n\n`;
    });
    
    cuerpoMensaje += `TOTAL: ${totalFormateado}\n\n`;
    cuerpoMensaje += `Fecha: ${new Date().toLocaleString('es-PY')}\n\n`;
    cuerpoMensaje += `📎 IMPORTANTE: Recuerde que debe acercar la consola al local para la instalación de los juegos.`;

    // Enviar por Gmail
    const emailDestino = 'betalabgamespedidos@gmail.com';
    const asunto = `🎮 PEDIDO PS3 - ${nombreValor} ${apellidoValor}`;
    const mailtoLink = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoMensaje)}`;
    
    // Mostrar alerta con instrucciones claras
    alert(`📧 SE ABRIRÁ GMAIL\n\n📎 INSTRUCCIONES IMPORTANTES:\n\n1. Se abrirá Gmail automáticamente\n2. Revisa que todos los datos estén correctos\n3. \n✅ Te estaremos contactando en el transcurso del día`);
    
    // Abrir cliente de correo
    window.location.href = mailtoLink;
    
    return false;
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 Página cargada - Carrito PS3");
    
    // Obtener carrito
    carrito = obtenerDatosCarrito();
    console.log("Carrito al cargar:", carrito);
    
    // Mostrar resumen
    mostrarResumenCarrito(carrito);
    
    // Actualizar monto
    const total = calcularTotalCarrito(carrito);
    actualizarMontoTransferencia(formatearNumeroConCeros(total) + ' Gs');
});

function actualizarMontoTransferencia(precio) {
    const montoValor = document.getElementById('monto-valor');
    if (montoValor) {
        montoValor.textContent = precio;
    }
}

// Hacer funciones globales
window.vaciarCarrito = vaciarCarrito;
window.enviarAGmailPS3 = enviarAGmailPS3;
window.probarFormulario = probarFormulario;

