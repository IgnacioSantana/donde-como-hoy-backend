import cloudinary from '../config/cloudinary.js';
import Restaurante from '../models/Restaurantes.js';

export const uploadImage = async (req, res) => {
  const { id } = req.params;
  const { imagen } = req.body;

  if (!imagen) {
    return res.status(400).json({ message: "No se ha enviado ninguna imagen" });
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(imagen, {
      folder: "restaurantes",
    });

    const restauranteActualizado = await Restaurante.findByIdAndUpdate(
      id,
      { imagen: uploadResponse.secure_url },
      { new: true }
    );

    if (!restauranteActualizado) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.status(200).json({
      message: "Imagen subida a Cloudinary correctamente",
      restaurante: restauranteActualizado,
    });
  } catch (error) {
    console.error("❌ Error al subir la imagen:", error);
    res.status(500).json({ message: "Error al subir la imagen" });
  }
};
