import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))
.catch((err) => console.error("Error de conexión a MongoDB:", err));

const RestauranteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
});
const Restaurante = mongoose.model("Restaurante", RestauranteSchema);

app.get("/", (req, res) => {
  res.send("API de Menú del Día operativa con MongoDB.");
});

app.post("/restaurantes", async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  try {
    const nuevoRestaurante = new Restaurante({ nombre, email, password });
    await nuevoRestaurante.save();
    res.status(201).json(nuevoRestaurante);
  } catch (err) {
    res.status(500).send("Error al registrar restaurante");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Obtener todos los restaurantes (para login)
app.get("/restaurantes", async (req, res) => {
  try {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
  } catch (err) {
    res.status(500).send("Error al obtener los restaurantes");
  }
});

