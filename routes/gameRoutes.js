import express from "express";
import { deleteGame, editGame, getAllGames, newGame } from "../controllers/gameController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(getAllGames).post(checkAuth, newGame);
router.delete("/delete/:id", checkAuth, deleteGame);
router.put("/edit/:id", checkAuth, editGame);
// router
//     .route('/:id')
//     .get(obtenerProducto)
//     .put(checkAuth, editarProducto)
//     .delete(checkAuth, eliminarProducto)
// ;
// router.get('/precio/:id', checkAuth, obtenerPrecio);
// router.post('/agregarCreador/:id', checkAuth, agregarCreador);
// router.delete('/eliminarCreador/:id', checkAuth, eliminarCreador);
export default router;
