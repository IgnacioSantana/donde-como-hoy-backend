import express from 'express';
import { uploadImage } from '../controllers/restaurantesController.js'; // Asegúrate de tener este controlador

const router = express.Router();

// Ruta para subir o actualizar imagen del restaurante
router.put('/:id/imagen', uploadImage);

export default router;
