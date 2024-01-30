import {
	Container,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TableRow from '../components/TableRow';
import { useDeleteFileMutation, useGetAllFilesQuery } from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import SkeletonList from '../ultis/SkeletonList';

const tableHeads = ['NAME', 'UPLOADED AT', '', ''];

export default function UserFileTab() {
	const { id } = useParams();
	const { data, error, isLoading, isFetching } = useGetAllFilesQuery([
		{
			key: 'uploadedBy',
			value: id,
		},
	]);
	const [deleteFile, deleteResults] = useDeleteFileMutation();
	const [downloadFile, setDownloadFile] = useState('');

	const handleFileDownload = (filename) => {
		setDownloadFile(filename);
		const link = document.createElement('a');
		link.id = 'helper-link';
		link.target = '_blank';
		link.download = `${filename.split('---')[1]}`;
		link.href = `http://localhost:3005/files/${filename}`;
		link.click();
	};

	useEffect(() => {
		if (!downloadFile) return;
		const helperLink = document.getElementById('helper-link');
		if (helperLink) return () => helperLink.remove();
	}, [downloadFile]);

	const handleFileDelete = (id) => {
		deleteFile(id);
	};

	if (isLoading)
		return (
			<Container maxWidth="sm">
				<LoadingBar />
				<SkeletonList spacing={4} times={4} />
			</Container>
		);

	if (error) return <Error message={error.data.message} />;

	if (data.results === 0)
		return (
			<Container
				maxWidth="lg"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					gap: 4,
					pb: 4,
				}}
			>
				<Typography variant="h4" sx={{ alignSelf: 'center', p: 4 }}>
					No files!
				</Typography>
			</Container>
		);

	const files = data.data.data.map((file) => {
		return {
			id: file._id,
			name: file.name,
			info: [
				file.name.split('---')[1],
				new Date(file.uploadedAt).toLocaleDateString('en-UK'),
			],
		};
	});

	const renderedTableHeads = <TableRow data={tableHeads} />;

	const renderedTableRows = files.map((file) => (
		<TableRow
			key={file.id}
			id={file.id}
			name={file.name}
			data={file.info}
			onDownload={handleFileDownload}
			onDelete={handleFileDelete}
		/>
	));

	return (
		<Container
			maxWidth="lg"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				gap: 4,
				pb: 4,
			}}
		>
			{(isFetching || deleteResults.isLoading) && <LoadingBar />}

			{deleteResults.isError && (
				<Error message={deleteResults.error.data.message} />
			)}

			<TableContainer sx={{ maxHeight: 800, minHeight: 400 }}>
				<Table stickyHeader>
					<TableHead>{renderedTableHeads}</TableHead>
					<TableBody>{renderedTableRows}</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}
