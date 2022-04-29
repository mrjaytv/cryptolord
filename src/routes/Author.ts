import express from "express";
import controller from "../controllers/Author";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post(
  "/create",
  ValidateSchema(Schemas.author.create),
  controller.createAuthor
);
router.get(
  "/read/:authorId",
  //   ValidateSchema(Schemas.author.create),
  controller.readAuthor
);
router.get("/read", controller.readAll);
router.patch(
  "/update/:authorId",
  ValidateSchema(Schemas.author.update),
  controller.updateAuthor
);
router.delete("/delete/:authorId", controller.deleteAuthor);

export = router;
