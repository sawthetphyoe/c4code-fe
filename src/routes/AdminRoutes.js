import { Routes, Route } from 'react-router-dom';
import CoursesPage from '../pages/CoursesPage';
import CourseInfoPage from '../pages/CourseInfoPage';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryInfoPage from '../pages/CategoryInfoPage';
import UsersPage from '../pages/UsersPage';
import UserInfoPage from '../pages/UserInfoPage';
import AdminHomePage from '../pages/AdminHomePage';

export default function AdminRoutes() {
	return (
		<Routes>
			<Route index element={<AdminHomePage />} />
			<Route path="/courses" element={<CoursesPage />} />
			<Route path="/courses/:id" element={<CourseInfoPage />} />
			<Route path="/categories" element={<CategoriesPage />} />
			<Route path="/categories/:id" element={<CategoryInfoPage />} />
			<Route path="/users" element={<UsersPage />} />
			<Route path="/users/:id" element={<UserInfoPage />} />
		</Routes>
	);
}
