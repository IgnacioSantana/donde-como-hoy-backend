import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Menu from "./models/Menu.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB conectado"))
.catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

// Esquema del modelo
const RestauranteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
});
const Restaurante = mongoose.model("Restaurante", RestauranteSchema);

// Ruta principal
app.get("/", (req, res) => {
  res.send("API de Dónde Como Hoy operativa con MongoDB.");
});

// Registro
app.post("/restaurantes", async (req, res) => {
  const { nombre, email, password } = req.body;
  const emailNormalizado = email.toLowerCase();


  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const restauranteExistente = await Restaurante.findOne({ email });

    if (restauranteExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoRestaurante = new Restaurante({
      nombre,
      email,
      password: hashedPassword,
    });

    await nuevoRestaurante.save();
    res.status(201).json({ message: "Restaurante registrado con éxito" });
  } catch (err) {
    console.error("Error al registrar restaurante:", err);
    res.status(500).json({ message: "Error al registrar restaurante" });
  }
});

// Login
app.post("/restaurantes/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Faltan el correo o la contraseña." });
  }

  try {
    const restaurante = await Restaurante.findOne({ email });

    if (!restaurante) {
      return res.status(401).json({ message: "Correo no registrado." });
    }

    const passwordValida = await bcrypt.compare(password, restaurante.password);

    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      restauranteId: restaurante._id,
      nombre: restaurante.nombre,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error del servidor durante el login" });
  }
});

// Obtener todos los restaurantes (opcional)
app.get("/restaurantes", async (req, res) => {
  try {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
  } catch (err) {
    res.status(500).send("Error al obtener los restaurantes");
  }
});
// Ruta para guardar menú
app.post("/menus", async (req, res) => {
  const { restauranteId, fecha, precio, primeros, segundos, incluye } = req.body;

  if (!restauranteId || !fecha || !precio) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const nuevoMenu = new Menu({ restauranteId, fecha, precio, primeros, segundos, incluye });
    await nuevoMenu.save();
    res.status(201).json(nuevoMenu);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar el menú" });
  }
});

// Ruta para obtener menú de un restaurante en una fecha
app.get("/menus/:restauranteId/:fecha", async (req, res) => {
  const { restauranteId, fecha } = req.params;

  try {
    const menu = await Menu.findOne({ restauranteId, fecha });
    if (!menu) return res.status(404).json({ message: "No hay menú para esta fecha" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el menú" });
  }
});

// ⬇️ ESTA PARTE NO DEBE FALTAR
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
