import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const coursesApi = createApi({
	reducerPath: 'courses',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3005/api/v1/',
		credentials: 'include',
	}),
	endpoints(builder) {
		return {
			createCourse: builder.mutation({
				invalidatesTags: (result, error, course) =>
					result ? ['allCourse', { type: 'category' }] : [],
				query: (course) => {
					return {
						url: 'courses',
						method: 'POST',
						body: course,
					};
				},
			}),
			getCourse: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'course', id }] : [],
				query: (id) => {
					return {
						url: `courses/${id}`,
						method: 'GET',
					};
				},
			}),
			getAllCourses: builder.query({
				providesTags: (result, error) =>
					result
						? [
								...result.data.data.map((course) => {
									return { type: 'course', id: course._id };
								}),
								'allCourse',
						  ]
						: [],
				query: (options) => {
					// options = { key: 'student', value: 'ID'}
					const queryString = options
						? '?' + options.map((opt) => `${opt.key}=${opt.value}`).join('&')
						: '';
					return {
						url: `courses${queryString}`,
						method: 'GET',
					};
				},
			}),
			updateCourse: builder.mutation({
				invalidatesTags: (result, error, course) =>
					result
						? [{ type: 'course', id: course.id }, { type: 'category' }]
						: [],
				query: (course) => {
					return {
						url: `courses/${course.id}`,
						method: 'PATCH',
						body: course.body,
					};
				},
			}),
			deleteCourse: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? [{ type: 'course' }, { type: 'category' }] : [],
				query: (id) => {
					return {
						url: `courses/${id}`,
						method: 'DELETE',
					};
				},
			}),
			createCategory: builder.mutation({
				invalidatesTags: (result, error, name) => [
					{ type: 'category' },
					'noCategory',
				],
				query: (name) => {
					return {
						url: 'categories',
						method: 'POST',
						body: {
							name,
						},
					};
				},
			}),
			getAllCategories: builder.query({
				providesTags: (result, error) =>
					result
						? [
								...result.data.data.map((cate) => {
									return { type: 'category', id: cate._id };
								}),
						  ]
						: ['noCategory'],
				query: () => {
					return {
						url: 'categories',
						method: 'GET',
					};
				},
			}),
			getCategory: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'category', id }] : [],
				query: (id) => {
					return {
						url: `categories/${id}`,
						method: 'GET',
					};
				},
			}),
			updateCategory: builder.mutation({
				invalidatesTags: (result, error, cate) =>
					result ? [{ type: 'category', id: cate.id }] : [],
				query: (cate) => {
					return {
						url: `categories/${cate.id}`,
						method: 'PATCH',
						body: cate,
					};
				},
			}),
			deleteCategory: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? [{ type: 'category' }] : [],
				query: (id) => {
					return {
						url: `categories/${id}`,
						method: 'DELETE',
					};
				},
			}),
			uploadFile: builder.mutation({
				invalidatesTags: (result, error, file) =>
					result ? [{ type: 'file' }, { type: 'course' }] : [],
				query: (file) => {
					return {
						url: 'files',
						method: 'POST',
						body: file.body,
					};
				},
			}),
			getAllFiles: builder.query({
				providesTags: (result, error) => (result ? [{ type: 'file' }] : []),
				query: (options) => {
					// options = { key: 'student', value: 'ID'}
					const queryString = options
						? '?' + options.map((opt) => `${opt.key}=${opt.value}`).join('&')
						: '';
					return {
						url: `files${queryString}`,
						method: 'GET',
					};
				},
			}),
			deleteFile: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? [{ type: 'file' }, { type: 'course' }] : [],
				query: (id) => {
					return {
						url: `files/${id}`,
						method: 'DELETE',
					};
				},
			}),
			createSection: builder.mutation({
				invalidatesTags: (result, error, section) =>
					result ? ['allSection'] : [],
				query: (section) => {
					return {
						url: 'sections',
						method: 'POST',
						body: section,
					};
				},
			}),
			getSection: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'section', id }] : [],
				query: (id) => {
					return {
						url: `sections/${id}`,
						method: 'GET',
					};
				},
			}),
			getAllSections: builder.query({
				providesTags: (result, error) =>
					result
						? [
								...result.data.data.map((section) => {
									return {
										type: 'section',
										id: section._id,
									};
								}),
								'allSection',
						  ]
						: [],
				query: (options) => {
					// options = { key: 'course', value: 'ID'}
					const queryString = options
						? '?' + options.map((opt) => `${opt.key}=${opt.value}`).join('&')
						: '';
					return {
						url: `sections${queryString}`,
						method: 'GET',
					};
				},
			}),
			updateSection: builder.mutation({
				invalidatesTags: (result, error, section) =>
					result
						? [
								{ type: 'section', id: section.id },
								{ type: 'course', id: section.course },
						  ]
						: [],
				query: (section) => {
					return {
						url: `sections/${section.id}`,
						method: 'PATCH',
						body: section.body,
					};
				},
			}),
			deleteSection: builder.mutation({
				invalidatesTags: (result, error, section) =>
					!error ? ['allSection', { type: 'course', id: section.course }] : [],
				query: (section) => {
					return {
						url: `sections/${section._id}`,
						method: 'DELETE',
					};
				},
			}),
			createLecture: builder.mutation({
				invalidatesTags: (result, error, data) =>
					result
						? [
								'lectures',
								{ type: 'section', id: data.lecture.section },
								{ type: 'course', id: data.courseId },
						  ]
						: [],
				query: (data) => {
					return {
						url: 'lectures',
						method: 'POST',
						body: data.lecture,
					};
				},
			}),
			getLecture: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'lecture', id }] : [],
				query: (id) => {
					return {
						url: `lectures/${id}`,
						method: 'GET',
					};
				},
			}),
			getAllLectures: builder.query({
				providesTags: (result, error) =>
					result
						? [
								...result.data.data.map((lecture) => {
									return { type: 'lecture', id: lecture._id };
								}),
								'lectures',
						  ]
						: [],
				query: (options) => {
					// options = { key: 'section', value: 'ID'}
					const queryString = options
						? '?' + options.map((opt) => `${opt.key}=${opt.value}`).join('&')
						: '';
					return {
						url: `lectures${queryString}`,
						method: 'GET',
					};
				},
			}),
			updateLecture: builder.mutation({
				invalidatesTags: (result, error, data) =>
					result
						? [
								{ type: 'lecture', id: data.lecture._id },
								{ type: 'section', id: data.lecture.section },
								{ type: 'course', id: data.courseId },
						  ]
						: [],
				query: (data) => {
					return {
						url: `lectures/${data.lecture._id}`,
						method: 'PATCH',
						body: data.lecture,
					};
				},
			}),
			deleteLecture: builder.mutation({
				invalidatesTags: (result, error, data) =>
					!error
						? [
								'lectures',
								{ type: 'section', id: data.lecture.section },
								{ type: 'course', id: data.courseId },
						  ]
						: [],
				query: (data) => {
					return {
						url: `lectures/${data.lecture._id}`,
						method: 'DELETE',
					};
				},
			}),
			createReview: builder.mutation({
				invalidatesTags: (result, error, review) =>
					result ? ['allReviews'] : [],
				query: (review) => {
					return {
						url: 'reviews',
						method: 'POST',
						body: review,
					};
				},
			}),
			updateReview: builder.mutation({
				invalidatesTags: (result, error, review) => {
					return result ? [{ type: 'review', id: review._id }] : [];
				},
				query: (review) => {
					return {
						url: `reviews/${review._id}`,
						method: 'PATCH',
						body: review,
					};
				},
			}),
			getAllReview: builder.query({
				providesTags: (result, error) =>
					result
						? [
								...result.data.data.map((review) => {
									return { type: 'review', id: review._id };
								}),
								'allReviews',
						  ]
						: [],
				query: (options) => {
					// options = { key: 'student', value: 'ID'}
					const queryString = options
						? '?' + options.map((opt) => `${opt.key}=${opt.value}`).join('&')
						: '';
					return {
						url: `reviews${queryString}`,
						method: 'GET',
					};
				},
			}),
			getReview: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'review', id }] : [],
				query: (id) => {
					return {
						url: `reviews/${id}`,
						method: 'GET',
					};
				},
			}),
			deleteReview: builder.mutation({
				invalidatesTags: (result, error, review) =>
					!error
						? ['allReviews', { type: 'course', id: review.course._id }]
						: [],
				query: (id) => {
					return {
						url: `reviews/${id}`,
						method: 'DELETE',
					};
				},
			}),
		};
	},
});

export const {
	useCreateCourseMutation,
	useGetCourseQuery,
	useGetAllCoursesQuery,
	useUpdateCourseMutation,
	useDeleteCourseMutation,
	useCreateCategoryMutation,
	useGetAllCategoriesQuery,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoryQuery,
	useUploadFileMutation,
	useGetAllFilesQuery,
	useDeleteFileMutation,
	useCreateLectureMutation,
	useGetLectureQuery,
	useGetAllLecturesQuery,
	useUpdateLectureMutation,
	useDeleteLectureMutation,
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
} = coursesApi;
export { coursesApi };
