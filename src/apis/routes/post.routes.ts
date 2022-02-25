import PromiseRouter from 'express-promise-router';
const router = PromiseRouter();
import requireUser from '../../middlewares/requireUser';
import * as postController from '../controllers/post.controller';
import { upload } from '../../utils';
// done
router
  .route('/')
  .get(postController.getAllPostsPage)
  .post(requireUser, upload.single('image'), postController.createNewPost);
//done
router.route('/get-public-posts').get(postController.getAllPublicPosts);
// done
router
  .route('/get-public-posts-by-category/:id')
  .get(postController.getPublicPostsByCategory);

//done
router
  .route('/get-posts-most-interested')
  .get(postController.getPostsMostInterested);
// done
router.route('/get-public-post/:id').get(postController.getPublicPost);

router
  .route('/get-posts-by-category/:id')
  .get(postController.getPostsByCategory);

router
  .route('/get-public-posts-order-by-created')
  .get(postController.getPublicPostsOrderByCreatedAt);

router
  .route('/get-post-detail-by-post-code')
  .post(postController.getPostDetailOfPostByCode);

router
  .route('/get-post-detail-by-post-id')
  .post(postController.getPostDetailOfPostById);

router
  .route('/upload-image')
  .post(upload.single('image'), postController.uploadImageOfPost);

router
  .route('/get-post-by-code')
  .post(requireUser, postController.getPostsByCode);

router
  .route('/get-public-post-by-code')
  .post(postController.getPublicPostByCode);

router.route('/get-tags').get(postController.getAllTags);

router.route('/search/tag').get(postController.searchByTag);

router.route('/search/query').post(postController.search);

router.route('/search-public').post(postController.searchPublicPostHandler);

router
  .route('/:id')
  .get(postController.getPost)
  .post(requireUser, postController.addPostDetail)
  .put(requireUser, upload.single('image'), postController.editPost);

router
  .route('/post-detail/:id')
  .get(postController.getPostDetail)
  .put(requireUser, postController.editPostDetail);

export default router;
