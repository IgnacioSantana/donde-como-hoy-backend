import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  restauranteId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurante", required: true },
  fecha: { type: String, required: true }, // formato YYYY-MM-DD
  precio: { type: String, required: true },
  primeros: [String],
  segundos: [String],
  incluye: {
    pan: Boolean,
    bebida: Boolean,
    postre: Boolean,
    cafe: Boolean
  }
});

export default mongoose.model("Menu", MenuSchema);
