import mongoose from "mongoose";

const RestauranteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  imagen: String // ✅ Campo para almacenar la URL o base64 de la imagen
});

const Restaurante = mongoose.model("Restaurante", RestauranteSchema);
export default Restaurante;
