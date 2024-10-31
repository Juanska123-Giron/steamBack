import express from "express";
import {
  addRequirementsToGame,
  deleteGame,
  editGame,
  getAllGames,
  newGame,
} from "../controllers/gameController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(getAllGames).post(checkAuth, newGame);
router.delete("/delete/:id", checkAuth, deleteGame);
router.put("/edit/:id", checkAuth, editGame);
router.put("/add/requirement/:id_game", checkAuth, addRequirementsToGame);
// router
//     .route('/:id')
//     .get(obtenerProducto)
//     .put(checkAuth, editarProducto)
//     .delete(checkAuth, eliminarProducto)
// ;s
// router.get('/precio/:id', checkAuth, obtenerPrecio);
// router.post('/agregarCreador/:id', checkAuth, agregarCreador);
// router.delete('/eliminarCreador/:id', checkAuth, eliminarCreador);
export default router;
