import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const categoriesApi = createApi({
	reducerPath: 'categories',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3005/api/v1/categories',
	}),
	endpoints(builder) {
		return {
			createCategory: builder.mutation({
				invalidatesTags: (result, error, name) => ['newCategory'],
				query: (name) => {
					return {
						url: '/',
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
								'newCategory',
						  ]
						: [],
				query: () => {
					return {
						url: '/',
						method: 'GET',
					};
				},
			}),
			getCategory: builder.query({
				providesTags: (result, error, id) =>
					result ? [{ type: 'category', id }] : [],
				query: (id) => {
					return {
						url: `${id}`,
						method: 'GET',
					};
				},
			}),
			updateCategory: builder.mutation({
				invalidatesTags: (result, error, cate) => [{ type: 'category' }],
				query: (cate) => {
					return {
						url: `${cate.id}`,
						method: 'PATCH',
						body: cate,
					};
				},
			}),
			deleteCategory: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? [{ type: 'category', id }] : [],
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
	useCreateCategoryMutation,
	useGetAllCategoriesQuery,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoryQuery,
} = categoriesApi;

export { categoriesApi };
