
const formulario = document.getElementById('formulario');
const supabaseUrl = "https://sdf.supse.co";
const supabaseKey =
  "eyJhbGciOiODY5MjksImV4cCI6MTk5OTY2MjkyOX0.waaqWMcoIkO_3ez63da9wEzehQrFFch5W2kbHdZUfOw";

const database = supabase.createClient(supabaseUrl, supabaseKey);

const createProduct = async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const cantidad = document.getElementById('cantidad').value;
    const precioVenta = document.getElementById('precioVenta').value;
    const precioCompra = document.getElementById('precioCompra').value;
    const imagen = document.getElementById('imagen').files[0]
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const categoria = document.getElementById('categoria').value;
    const marca = document.getElementById('marca').value;

    //subir imagen
    let imagenUrl = null;
    if (imagen) {
        const {data, error} = await database.storage.from('productos').upload(`productos/${imagen.name}`, imagen);

        if (error) {
            console.log(error);
            return;
        }
        imagenUrl = `https://zqntnjnwhjchamppgacx.supabase.co/storage/v1/object/public/productos/${data.path}`;
    }
    //insertar en la tabla
    const {data, error} = await database.from('productos').insert([
        {
            nombre,
            cantidad: +cantidad,
            precio_venta: +precioVenta,
            precio_compra: +precioCompra,
            precio_total: precioVenta * cantidad,
            imagen: imagenUrl,
            fecha_vencimiento: fechaVencimiento,
            categoria,
            marca
        }
    ]);

    if (error) {
        console.log(error);
        return
    }

    Toastify({
        text: "Producto agregado correctamente a la base de datos.",
        offset: {
          x: 50, 
          y: 10 
        }
      }).showToast();

    //limpiar formulario
    console.log('Producto creado')
    formulario.reset();
};

formulario.addEventListener('submit', createProduct);
