import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

// Modelo de Restaurante
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

// 🟢 Registro de restaurante
app.post("/restaurantes", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const restauranteExistente = await Restaurante.findOne({ email });

    if (restauranteExistente) {
      return res.status(
