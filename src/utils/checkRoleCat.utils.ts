import { getRolesOfUser } from '../services/user/userRoles';
import { getCatsOfRoles } from '../services/category/cateRole';
import ApiError from './api-error';
import httpStatus from 'http-status';

function arrayContainsArray(superset: number[], subset: number[]): boolean {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return superset.indexOf(value) >= 0;
  });
}

function isArrayOfStrings(value: any[]): boolean {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

export default async function requireRoleCat(
  userID: number,
  categoryIDs: string[] | number[]
) {
  let numCategoriesId: number[];

  if (isArrayOfStrings(categoryIDs)) {
    numCategoriesId = categoryIDs.map((i) => Number(i));
  } else {
    numCategoriesId = categoryIDs as number[];
  }
  const rolesOfUser = await getRolesOfUser(userID);
  const roleIds = rolesOfUser.map((role) => role.id);
  const cats = await getCatsOfRoles(roleIds);
  // arr number cat id of user can be access
  const catIds = cats.map((cat) => cat.id);
  console.log(catIds);
  console.log(numCategoriesId);

  if (!arrayContainsArray(catIds, numCategoriesId))
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'you must have roles of category to access this route'
    );
}
