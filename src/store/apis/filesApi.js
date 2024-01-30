import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const fileApi = createApi({
	reducerPath: 'files',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:3005/api/v1/files',
		credentials: 'include',
	}),
	endpoints(builder) {
		return {
			uploadFile: builder.mutation({
				invalidatesTags: (result, error, file) =>
					result ? [{ type: 'file' }] : [],
				query: (file) => {
					return {
						url: '/',
						method: 'POST',
						body: file.body,
					};
				},
			}),
			getAllFiles: builder.query({
				providesTags: (result, error) => (result ? [{ type: 'file' }] : []),
				query: (query) => {
					const url = query ? `?uploadedBy=${query}` : '/';
					return {
						url,
						method: 'GET',
					};
				},
			}),
			deleteFile: builder.mutation({
				invalidatesTags: (result, error, id) =>
					!error ? [{ type: 'file' }] : [],
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
	useUploadFileMutation,
	useGetAllFilesQuery,
	useDeleteFileMutation,
} = fileApi;

export { fileApi };
