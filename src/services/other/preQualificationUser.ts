import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import { PreQualificationUser } from '../../interfaces';
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const addPreQualificationUserSv = async (
  preQualificationUserData: PreQualificationUser
) => {
  return prisma.preQualificationUser.create({
    data: preQualificationUserData,
  });
};



const getAllPreQualificationUserSv = async () => {
  return prisma.preQualificationUser.findMany({});
};

const getPreQualificationUserByID = async (id: number) => {
  return prisma.preQualificationUser.findFirst({
    where: {
      id: +id,
    },
  });
};

const deletePreQualificationUserArr = async (arrId: string[]) => {
  const arrIdNumber = arrId.map((id) => +id);

  return prisma.preQualificationUser.deleteMany({
    where: {
      id: {
        in: arrIdNumber,
      },
    },
  });
};

const getOnePreQualificationUser = async (email: string,phoneNumber: string) => {
  return prisma.preQualificationUser.findFirst({
    where: {
      OR: [
        {email: email},
        {phoneNumber: phoneNumber}
      ]
    }
  })
}

const getAllUserPrequalificationToExportExcel = async () => {
  return prisma.preQualificationUser.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      height: true,
      weight:true,
      dateOfBirth: true,
      address: true,
      gender: true,
      healthCare: true,
      tattoo: true,
      academicLevel: true,
      levelEnglish: true,
      presenter: true,
      learningStatus: true,
      status: true
    }
  });
};

export {
  addPreQualificationUserSv,
  getAllPreQualificationUserSv,
  getPreQualificationUserByID,
  deletePreQualificationUserArr,
  getOnePreQualificationUser,
  getAllUserPrequalificationToExportExcel
};
