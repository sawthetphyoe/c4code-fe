import { Route, Routes } from 'react-router-dom';
import CoursePlayPage from '../pages/CoursePlayPage';
import StudentHomePage from '../pages/StudentHomePage';

export default function StudentRoutes() {
	return (
		<Routes>
			<Route path="/" element={<StudentHomePage />} />
			<Route
				path="/course/:courseId/:enrollmentId"
				element={<CoursePlayPage />}
			/>
		</Routes>
	);
}
