import express from 'express'
import {createPool} from 'mysql2/promise'
import {config} from 'dotenv'
import rutas from './rutas/rutas.js';
import cors from "cors";
config()


const app = express ()

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    port: 3306,
    database: process.env.MYSQL_DATABASE
})

app.use(cors());
app.use(express.json());

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nameProduct VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                urlImage VARCHAR(255) NOT NULL
            )
        `);

        console.log("Tabla 'users' creada exitosamente.");
    } catch (error) {
        console.error('Error al intentar crear la tabla:', error);
    }
    try {
        // ========== PRODUCTS ==========
        const [rows, fields] = await pool.query('SELECT * FROM productos');

        if (rows.length === 0) {
            // Insertar productos si no existen
            const productos = [
                ["Galgo Ingles", `Ser:
            
            Inteligente, cariñosa, acogedora
            Talla: Grande
            Altura: 70-73 cm
            Peso: 20-50 kg
            Esperanza de vida: 10-14 años
            Tipo de abrigo: Pelo Corto
            Colores: Negro, Blanco, Rojo, Azul, Marrón rojizo-amarillo, Color arena, Atigrado
            Grupo FCI: Galgos
            
            Con una velocidad de carrera posible de 80 kilómetros por hora, el Galgo inglés está considerado el perro más rápido del mundo y es uno de los animales terrestres más veloces de todos. Criado originalmente para la caza, el galgo es sinónimo de casi cualquier otra raza. Sin embargo, el Galgo inglés también es un leal perro de familia al que le encanta tumbarse en el sofá con su "manada" y disfruta de muchos mimos. Esto no significa, sin embargo, que se pueda tener con otras razas. Prepárate para impresionantes carreras en los paseos.`, "https://i.imgur.com/jdl4Khr.jpeg"],
                ["Dálmata", `Ser:
            
            Amigable, Valiente, Vivaz
            Talla: Grande
            Altura: 54-62 cm
            Peso: 20-30 kg
            Esperanza de vida: 11 - 13 años
            Tipo de abrigo: Pelo Corto
            Colores: Blanco puro con manchas negras o marrón hígado
            Grupo FCI: Perros corredores - Perros sudadores - Razas relacionadas
            
            El dálmata es una raza croata. Los dálmatas son perros corredores y soldadores y tienen un carácter muy amistoso. Son especialmente populares como perros de familia por su carácter vivaz. También se han hecho famosos en el cine y la televisión.`, "https://i.imgur.com/zKwL7D4.jpeg"],
                ["Corgi", `Ser:
            
            Persistente, Valiente, Extrovertida
            Talla: Pequeño
            Altura: 25-30 cm
            Peso: 9-12 kg
            Esperanza de vida: 12-15 años
            Tipo de abrigo: Pelo Corto
            Colores: Leonado, Negro y fuego, Azul, Negro y blanco, Rojo
            Grupo FCI: Perros pastores - Perros boyeros
            
            El corgi galés de Pembroke es una raza canina británica cuyos orígenes se remontan al siglo X. Esta raza es pequeña y, por tanto, muy adecuada para mantenerla en interiores. También fue la raza de la reina británica. Sin embargo, el corgi galés de Pembroke no es un perro faldero puro, sino que necesita variedad y ejercicio.`, "https://i.imgur.com/0duBbbu.jpeg"],
                ["Chow Chow", `Ser:
            
            Reservada, Leal, Independiente
            Talla: Medio
            Altura: 46-56 cm
            Peso: 20-32 kg
            Esperanza de vida: 8-12 años
            Tipo de abrigo: Pelo largo
            Colores: Negro, Rojo, Azul, Leonado, Crema, Blanco
            Grupo FCI: Spitz - perros de tipo primitivo
            
            El Chow Chow es una raza canina muy conocida e inusual. Los perros proceden originariamente de China. El Chow Chow está reconocido por la FCI y asignado al Grupo 5 (Spitz asiático). Estos esponjosos amigos de cuatro patas tienen un aspecto muy llamativo y característico. Se fijan mucho en una sola persona. Como propietario de un perro, debes ser consciente de ello.`, "https://i.imgur.com/z3FoDmX.jpeg"],
                ["Bull Terrier", `Ser:
            
            Amable, Perceptivo, Protector
            Talla: Medio
            Altura: 45-55 cm
            Peso: 22-38 kg
            Esperanza de vida: 10-14 años
            Tipo de abrigo: Pelo Corto
            Colores: Blanco, Atigrado Blanco, Rojo y Blanco, Leonado Blanco, Blanco y Negro Atigrado
            Grupo FCI: Terrier
            
            La historia del bull terrier está llena de malentendidos. Debido a su naturaleza intrépida, el Bully hace olvidar demasiado a menudo a sus dueños lo juguetón y mimoso que es. Un Bully necesita mucho afecto para sentirse a gusto. Quien elija un terrier debe buscar un compañero de juegos leal, valiente y cariñoso. Quien piense en luchar, debería apuntarse al club local de artes marciales.`, "https://i.imgur.com/ZYXa9zr.jpeg"],
                ["Borzoi", `Ser:
            
            Tranquilo, Inteligente, Tímido
            Talla: Grande
            Altura: 68-85 cm
            Peso: 25-47 kg
            Esperanza de vida: 10-14 años
            Tipo de abrigo: Pelo largo
            Colores: Combinación de todos los colores (nunca con azul, marrón o gradaciones de éstos)
            Grupo FCI: Galgos
            
            El borzoi es un galgo orgulloso y noble que necesita mucho ejercicio y libertad. Es uno de los animales más rápidos del mundo. Su ansia de moverse es correspondientemente grande. Sin embargo, son criaturas tranquilas y apacibles, muy adecuadas como perros de familia. El borzoi es una mezcla perfecta de aspecto orgulloso y temperamento educado.`, "https://i.imgur.com/lGpLLfo.jpeg"]
            ];

            const insertQuery = 'INSERT INTO productos (nameProduct, description, urlImage) VALUES (?, ?, ?)';

            for (const producto of productos) {
                await pool.query(insertQuery, producto);
            }
        }


        console.log("Base inicializada correctamente");
    } catch (error) {
        console.error("Error inicializando la base de datos:", error);
    }
        
    

};

app.get('/',(req, res) => {
    res.send('Hola mundo')
})

app.get('/hora',async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    res.json(result[0])

})

app.use('/users', rutas);

app.listen(3000, async () => {
    await initializeDatabase();
    console.log('Servidor corriendo en el puerto', 3000);
});

