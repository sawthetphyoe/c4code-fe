import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const lectureApi = createApi({
	reducerPath: 'lectures',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3005/api/v1/lectures',
		credentials: 'include',
	}),
	endpoints(builder) {
		return {
			createLecture: builder.mutation({
				invalidatesTags: (result, error, lecture) =>
					result
						? [
								{ type: 'lecture', id: result.data.data._id },
								{ type: 'course', id: lecture.courseID },
						  ]
						: [],
				query: (lecture) => {
					return {
						url: '/',
						method: 'POST',
						body: lecture,
					};
				},
			}),
			getLecture: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'lecture', id }] : [],
				query: (id) => {
					return {
						url: `${id}`,
						method: 'GET',
					};
				},
			}),
			updateLecture: builder.mutation({
				invalidatesTags: (result, error, lecture) =>
					result ? [{ type: 'lecture', id: lecture.id }] : [],
				query: (lecture) => {
					return {
						url: `${lecture.id}`,
						method: 'PATCH',
						body: lecture,
					};
				},
			}),
			deleteLecture: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? [{ type: 'lecture', id }] : [],
				query: (id) => {
					return {
						url: `${id}`,
						method: 'DELETE',
					};
				},
			}),
		};
	},
});

export const {
	useCreateLectureMutation,
	useGetLectureQuery,
	useUpdateLectureMutation,
	useDeleteLectureMutation,
} = lectureApi;
export { lectureApi };
