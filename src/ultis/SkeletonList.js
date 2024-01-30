import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function SkeletonList({ spacing, times }) {
	const boxes = Array(times)
		.fill(0)
		.map((_, i) => (
			<Skeleton key={i} variant="rectangular" height={60} animation="wave" />
		));

	return (
		<Stack spacing={spacing} sx={{ pb: 2 }}>
			{boxes}
		</Stack>
	);
}
