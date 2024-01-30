import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const usersApi = createApi({
	reducerPath: 'users',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3005/api/v1',
		credentials: 'include',
	}),
	endpoints(builder) {
		return {
			createUser: builder.mutation({
				invalidatesTags: (result, error, user) => (result ? ['user'] : []),
				query: (user) => {
					return {
						url: 'users/register',
						method: 'POST',
						body: {
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email,
							role: user.role,
						},
					};
				},
			}),
			getAllUsers: builder.query({
				providesTags: (result, error) => {
					return result
						? [
								...result.data.data.map((user) => ({
									type: 'user',
									id: user._id,
								})),
						  ]
						: [];
				},
				query: () => {
					return {
						url: 'users',
						method: 'GET',
					};
				},
			}),
			getUserById: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'user', id }] : [],
				query: (id) => {
					return {
						url: `users/${id}`,
						method: 'GET',
					};
				},
			}),
			updateUserById: builder.mutation({
				invalidatesTags: (result, error, user) =>
					result ? [{ type: 'user', id: user.id }] : [],
				query: (user) => {
					return {
						url: `users/${user.id}`,
						method: 'PATCH',
						body: user.body,
					};
				},
			}),
			deleteUserById: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? [{ type: 'user', id }] : [],
				query: (id) => {
					return {
						url: `users/${id}`,
						method: 'DELETE',
					};
				},
			}),
			checkLogin: builder.query({
				providesTags: (result, error) => [{ type: 'loginUser' }],
				query: () => {
					return {
						url: 'users/check-login',
						method: 'GET',
					};
				},
			}),
			loginUser: builder.mutation({
				invalidatesTags: (result, error) => [{ type: 'loginUser' }],
				query: ({ email, password }) => {
					return {
						url: `users/login`,
						method: 'POST',
						body: {
							email,
							password,
						},
					};
				},
			}),
			userLogout: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? ['user', 'loginUser'] : [],
				query: () => {
					return {
						url: 'users/logout',
						method: 'GET',
					};
				},
			}),
			resetPassword: builder.mutation({
				query: (id) => {
					return {
						url: `users/resetPassword/${id}`,
						method: 'PATCH',
						body: {
							id: id,
						},
					};
				},
			}),
			changeUserPhoto: builder.mutation({
				invalidatesTags: (result, error) =>
					result ? [{ type: 'loginUser' }] : [],
				query: (data) => {
					return {
						url: 'users/me',
						method: 'PATCH',
						body: data,
					};
				},
			}),
			changePassword: builder.mutation({
				invalidatesTags: (result, error) =>
					result ? [{ type: 'loginUser' }] : [],
				query: (data) => {
					return {
						url: 'users/updateMyPassword',
						method: 'POST',
						body: data,
					};
				},
			}),
			createEnrollment: builder.mutation({
				invalidatesTags: (result, error, data) =>
					result ? ['allEnrol', { type: 'user', id: data.student }] : [],
				query: (data) => {
					return {
						url: `enrollments`,
						method: 'POST',
						body: data,
					};
				},
			}),
			getAllEnrollments: builder.query({
				providesTags: (result, error) =>
					result
						? [
								...result.data.data.map((em) => {
									return { type: 'enrol', id: em._id };
								}),
								'allEnrol',
						  ]
						: [],
				query: (options) => {
					const queryString = options
						? '?' + options.map((opt) => `${opt.key}=${opt.value}`).join('&')
						: '';
					return {
						url: `enrollments${queryString}`,
						method: 'GET',
					};
				},
			}),
			getEnrollment: builder.query({
				providesTags: (result, error, data) =>
					result ? [{ type: 'enrol', id: result.data.data._id }] : [],
				query: (data) => {
					return {
						url: `enrollments/${data.id}`,
						method: 'GET',
					};
				},
			}),
			updateEnrollment: builder.mutation({
				invalidatesTags: (result, error, data) =>
					result
						? [
								'allEnrol',
								{ type: 'enrol', id: data._id },
								{ type: 'user', id: data.student._id },
						  ]
						: [],
				query: (data) => {
					return {
						url: `enrollments/${data._id}`,
						method: 'PATCH',
						body: data,
					};
				},
			}),
			deleteEnrollment: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? ['allEnrol', { type: 'user' }] : [],
				query: (id) => {
					return {
						url: `enrollments/${id}`,
						method: 'DELETE',
					};
				},
			}),
			updateCompletedLecture: builder.mutation({
				invalidatesTags: (result, error, data) =>
					result ? [{ type: 'enrol', id: data.enrollmentId }] : [],
				query: (data) => {
					return {
						url: `enrollments/lectures/${data.enrollmentId}`,
						method: 'PATCH',
						body: data.body,
					};
				},
			}),
		};
	},
});

export const {
	useCreateUserMutation,
	useGetAllUsersQuery,
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
} = usersApi;
export { usersApi };
