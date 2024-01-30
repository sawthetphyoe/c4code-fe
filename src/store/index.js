import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { usersApi } from './apis/usersApi';
import { coursesApi } from './apis/coursesApi';
// import { categoriesApi } from './apis/categoriesApi';
// import { lectureApi } from './apis/lecturesApi';
// import { fileApi } from './apis/filesApi';

export const store = configureStore({
	reducer: {
		[usersApi.reducerPath]: usersApi.reducer,
		[coursesApi.reducerPath]: coursesApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware()
			.concat(usersApi.middleware)
			.concat(coursesApi.middleware);
	},
});

setupListeners(store.dispatch);

export {
	useGetAllUsersQuery,
	useCreateUserMutation,
	useGetUserByIdQuery,
	useUpdateUserByIdMutation,
	useDeleteUserByIdMutation,
	useLoginUserMutation,
	useCheckLoginQuery,
	useUserLogoutMutation,
	useResetPasswordMutation,
	useChangeUserPhotoMutation,
	useChangePasswordMutation,
	useCreateEnrollmentMutation,
	useDeleteEnrollmentMutation,
	useUpdateEnrollmentMutation,
	useGetAllEnrollmentsQuery,
	useGetEnrollmentQuery,
	useUpdateCompletedLectureMutation,
} from './apis/usersApi';

export {
	useCreateCourseMutation,
	useGetAllCoursesQuery,
	useGetCourseQuery,
	useUpdateCourseMutation,
	useDeleteCourseMutation,
	useCreateLectureMutation,
	useGetLectureQuery,
	useGetAllLecturesQuery,
	useUpdateLectureMutation,
	useDeleteLectureMutation,
	useUploadFileMutation,
	useGetAllFilesQuery,
	useDeleteFileMutation,
	useCreateCategoryMutation,
	useGetAllCategoriesQuery,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoryQuery,
	useCreateSectionMutation,
	useDeleteSectionMutation,
	useUpdateSectionMutation,
	useGetAllSectionsQuery,
	useGetSectionQuery,
	useCreateReviewMutation,
	useDeleteReviewMutation,
	useGetAllReviewQuery,
	useGetReviewQuery,
	useUpdateReviewMutation,
} from './apis/coursesApi';
