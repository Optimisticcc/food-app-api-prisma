import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import {
  AddPostInput,
  AddPostDetail,
  UpdatePostInput,
  EditPostDetail,
} from '../../interfaces';
import { PostType, Prisma, PrismaClient, StatusPost } from '@prisma/client';
import { rest } from 'lodash';
import {
  catchAsync,
  removeVietnameseTones,
  removeVietnameseTonesStrikeThrough,
} from '../../utils/';
const prisma = new PrismaClient();

const getAllPosts = async (status: StatusPost) => {
  return status
    ? await prisma.post.findMany({
        where: {
          status,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    : await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
};

const findAllPosts = async (filter: Prisma.PostWhereInput) => {
  return prisma.post.findMany({
    where: filter,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      postCategory: {
        select: {
          category: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
};

// const getAllPosts = async (filter: Prisma.PostWhereInput) => {
//     return prisma.post.findMany({
//         where: filter
//     })
// }

const getAllPostsByCate = async (categoryID: number) => {
  return prisma.post.findMany({
    where: {
      postCategory: {
        some: {
          categoryID: +categoryID,
        },
      },
    },
    include: {
      postCategory: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getAllPublicPostsByCate = async (categoryID: number) => {
  return prisma.post.findMany({
    where: {
      status: StatusPost.PUBLIC,
      postCategory: {
        some: {
          categoryID: +categoryID,
        },
      },
    },
    include: {
      postCategory: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getAllPostsMostInterested = async () => {
  return prisma.post.findMany({
    where: {
      status: StatusPost.PUBLIC,
    },
    orderBy: {
      views: 'desc',
    },
  });
};

// function addCategoriesPost(postId: number, categoryId: number) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const post = prisma.post.update({
//                 where: {
//                     id: postId
//                 },
//                 data: {
//                     postCategory: {
//                         connect: {
//                             postID_categoryID: {
//                                 categoryID: categoryId,
//                                 postID: postId
//                             }
//                         }
//                     }
//                 }
//             })
//             resolve(post)
//         }, Math.floor(Math.random() * 1000));
//     });
// }
const checkCategoriesToAddPost = async (categories: number[]) => {
  for (const category of categories) {
    const cat = await prisma.category.findFirst({
      where: {
        id: +category,
      },
      include: {
        parent: true,
      },
    });

    if (!cat) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cannot found category to add');
    }

    if (cat?.parentID) {
      const catParent = await prisma.category.findFirst({
        where: {
          id: +cat?.parentID,
        },
        select: {
          id: true,
        },
      });
      if (categories.find((c) => c === catParent?.id) !== undefined) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Category parent and category son cannot add to post'
        );
      }
    } else {
      const categoriesSon = await prisma.category.findFirst({
        where: {
          parentID: cat.id,
        },
      });
      if (categoriesSon) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Category have son cannot to add post'
        );
      }
    }
  }
  return true;
};

const addCategoriesToPost = async (postId: number, postData: AddPostInput) => {
  const { categories, ...rest } = postData;
  const data: Prisma.PostCategoryCreateManyInput[] = categories.map((catId) => {
    return {
      categoryID: +catId,
      postID: postId,
    };
  });
  // return data
  return prisma.postCategory.createMany({
    data: data,
  });
};

const deleteCategoriesToPost = async (postId: number) => {
  // return data
  return prisma.postCategory.deleteMany({
    where: {
      postID: +postId,
    },
  });
};

const checkPostExistByTitle = async (title: string) => {
  return prisma.post.findFirst({
    where: {
      title: title,
    },
  });
};

const addPost = async (postData: AddPostInput) => {
  const { categories, ...rest } = postData;
  const postDataToInsert: Prisma.PostCreateInput = {
    title: postData.title,
    removeVietnameseTitle: postData.removeVietnameseTitle,
    image: postData.image,
    author: postData.author,
    type: postData.type,
    tags: postData.tags,
    header: postData.header,
    summary: postData.summary,
    status: postData.status,
  };

  postDataToInsert.User = {
    connect: {
      id: postData.userId,
    },
  };
  return prisma.post.create({
    data: postDataToInsert,
  });
};

const getAllPublicPostsTags = async () => {
  return prisma.post.findMany({
    where: {
      status: StatusPost.PUBLIC,
    },
  });
};

const getAllPublicPostsSv = async () => {
  return prisma.post.findMany({
    where: {
      status: StatusPost.PUBLIC,
    },
    include: {
      postCategory: {
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getPublicPostByID = async (id: number) => {
  const post = await prisma.post.findFirst({
    where: {
      id: +id,
    },
  });
  console.log(
    '🚀 ~ file: index.ts ~ line 272 ~ getPublicPostByID ~ post',
    post
  );
  if (post?.status !== StatusPost.PUBLIC || !post) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'get post details failure, require login to get this post or post not found'
    );
  }
  await prisma.post.update({
    where: {
      id: +id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
  return prisma.post.findFirst({
    where: {
      status: StatusPost.PUBLIC,
      id: +id,
    },
    include: {
      postCategory: {
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      User: {
        select: {
          name: true,
        },
      },
    },
  });
};

const getPostDetailOfPostPublic = async (id: number) => {
  return prisma.postDetail.findMany({
    where: {
      postId: +id,
      enable: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

const getPostByID = async (id: number) => {
  return prisma.post.findFirst({
    where: {
      id: +id,
    },
    include: {
      postCategory: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

const getPostDetailOfPost = async (id: number) => {
  return prisma.postDetail.findMany({
    where: {
      postId: +id,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

const addPostDetailSv = async (postDetailData: AddPostDetail) => {
  const post = await prisma.post.findFirst({
    where: {
      id: +postDetailData.postId,
    },
  });

  if (!post) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Cannot find post to add post detail'
    );
  } else {
    const getAllPostDetail = await prisma.postDetail.findMany({
      where: {
        postId: post?.id,
      },
    });
    if (post.type === PostType.NORMAL && getAllPostDetail.length === 1) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Post with type NORMAL only have one post detail and post detail existed'
      );
    }
  }

  return prisma.postDetail.create({
    data: {
      content: postDetailData.content,
      enable: postDetailData?.enable,
      createdBy: postDetailData.createdBy,
      Post: {
        connect: {
          id: +postDetailData.postId,
        },
      },
    },
  });
};

const updatePost = async (
  postId: number,
  type: PostType,
  postData: UpdatePostInput
) => {
  const { categories, ...rest } = postData;
  const post = await getPostFilter({ id: +postId });
  const postDetail = await prisma.postDetail.findMany({
    where: {
      postId: +postId,
    },
  });

  if (
    type == PostType.TIMELINE &&
    postDetail.length > 1 &&
    postData.type === PostType.NORMAL
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Cannot update post have many postDetail from type TIMELINE to NORMAL'
    );
  }

  if (postData.status !== StatusPost.PUBLIC) {
    if (postDetail.length > 0) {
      await prisma.postDetail.updateMany({
        where: {
          postId: +postId,
        },
        data: {
          enable: false,
        },
      });
    }
  } else {
    if (postDetail.length > 0) {
      await prisma.postDetail.updateMany({
        where: {
          postId: +postId,
        },
        data: {
          enable: true,
        },
      });
    }
  }

  return prisma.post.update({
    where: {
      id: +postId,
    },
    data: {
      ...rest,
      image: postData.image ? postData.image : post?.image,
      postCategory: {
        deleteMany: {},
      },
    },
  });
};

const getPostDetailByID = async (id: number) => {
  return prisma.postDetail.findFirst({
    where: {
      id: +id,
    },
  });
};

const updatePostDetailByID = async (
  id: number,
  postDetailData: EditPostDetail
) => {
  console.log(postDetailData);
  return prisma.postDetail.update({
    where: {
      id: +id,
    },
    data: postDetailData,
  });
};

const getAllPostByCode = async (id: number) => {
  return prisma.post.findMany({
    where: {
      postCategory: {
        some: {
          categoryID: +id,
        },
      },
    },
    select: {
      id: true,
      postCategory: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getAllPublicPostByCode = async (id: number) => {
  return prisma.post.findMany({
    where: {
      status: StatusPost.PUBLIC,
      postCategory: {
        some: {
          categoryID: +id,
        },
      },
    },
    include: {
      postCategory: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      User: {
        select: {
          name: true,
        },
      },
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const searchByTagSv = async (tag: string) => {
  const publicPosts = await getAllPublicPostsSv();
  return publicPosts
    .map((post) => {
      post.tags = post.tags.map((tag) =>
        removeVietnameseTonesStrikeThrough(tag)
      );
      return post;
    })
    .filter((post) => post.tags.includes(tag));
};

const searchByQuery = async (q: string, categoryId: number) => {
  const publicPosts = await getAllPostsByCate(+categoryId);
  return publicPosts.filter((post) => post.removeVietnameseTitle.includes(q));
};

const searchPostByQuery = async (q: string) => {
  const publicPosts = await findAllPosts({ status: 'PUBLIC' });
  return publicPosts.filter((post) => post.removeVietnameseTitle.includes(q));
};

const getPublicPostOrderByCreated = async () => {
  return prisma.post.findMany({
    where: {
      status: StatusPost.PUBLIC,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      postCategory: {
        include: {
          category: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
};

const getPostFilter = async (filter: Prisma.PostWhereInput) => {
  return prisma.post.findFirst({
    where: filter,
    include: {
      postCategory: {
        include: {
          category: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
};

const getDetailPostByCodeOrder = async (postId: number) => {
  return prisma.postDetail.findMany({
    where: {
      postId: +postId,
      enable: true,
    },
  });
};

const updateView = async (filter: Prisma.PostWhereUniqueInput) => {
  return prisma.post.update({
    where: filter,
    data: {
      views: {
        increment: 1,
      },
    },
  });
};

const getPostDetailFilter = async (filter: Prisma.PostDetailWhereInput) => {
  return prisma.postDetail.findFirst({
    where: filter,
  });
};

const getPostByPostDetailID = async (id: number) => {
  const postDetail = await prisma.postDetail.findFirst({
    where: {
      id: +id,
    },
  });

  const post = await prisma.post.findFirst({
    where: { id: postDetail?.postId },
  });
  return post;
};

export {
  getAllPosts,
  getAllPostByCode,
  checkCategoriesToAddPost,
  updatePostDetailByID,
  getPostDetailByID,
  updatePost,
  addCategoriesToPost,
  addPostDetailSv,
  getPostByID,
  getPostDetailOfPost,
  getAllPostsByCate,
  getPublicPostByID,
  getPostDetailOfPostPublic,
  getAllPublicPostsSv,
  getAllPublicPostsByCate,
  getAllPostsMostInterested,
  addPost,
  getAllPublicPostByCode,
  getAllPublicPostsTags,
  searchByTagSv,
  searchByQuery,
  findAllPosts,
  checkPostExistByTitle,
  getPublicPostOrderByCreated,
  getPostFilter,
  getDetailPostByCodeOrder,
  updateView,
  getPostByPostDetailID,
  searchPostByQuery,
};
