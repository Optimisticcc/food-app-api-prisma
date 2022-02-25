import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();

import {
  createCategoryParent,
  createCategoryChildren,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getAllCategoriesChildrenOfParent,
  getCategoryChildrenByID,
  getCategoriesByType,
  getPublicCategories,
  getAllPublicCategoriesChildrenOfParent,
  getPublicCategoriesChildWithParrent,
  getCategories,
  updateCategoryParent,
  getCategoryParentByID,
  getAllListCatsHandle,
} from '../controllers/category.controller';
import requireUser, { requireAdmin0 } from '../../middlewares/requireUser';
// get all category
router.route('/').get(requireUser, getAllCategories);

router.route('/get-all-list-cats').get(requireUser, getAllListCatsHandle);

router.route('/add-category-parent').post(requireAdmin0, createCategoryParent);

router.route('/add-category-child').post(requireAdmin0, createCategoryChildren);

router.route('/get-public-categories').get(getPublicCategories);
router.route('/get-categories').get(requireUser, getCategories);
// ca k public
router
  .route('/get-public-categories-child-parent')
  .get(getPublicCategoriesChildWithParrent);
router.route('/get-categories/:type').get(getCategoriesByType);
// get all children
router
  .route('/get-children/:id')
  .get(requireUser, getAllCategoriesChildrenOfParent);
//get public children of parent

router
  .route('/get-public-children/:id')
  .get(getAllPublicCategoriesChildrenOfParent);

router
  .route('/category-child/:id')
  .get(getCategoryChildrenByID)
  .put(requireAdmin0, updateCategory)
  .delete(requireAdmin0, deleteCategory);

router
  .route('/category-parent/:id')
  .get(getCategoryParentByID)
  .put(requireAdmin0, updateCategoryParent);

export default router;
// get all category require User
// get public category khong require User
// get public children category
// get all children require User
