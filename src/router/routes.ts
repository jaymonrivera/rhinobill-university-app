import ApplicationList from 'src/pages/ApplicationList.vue';
import CourseList from 'src/pages/CourseList.vue';
import StudentList from 'src/pages/StudentList.vue';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'students', component: StudentList },
      { path: 'courses', component: CourseList },
      { path: 'applications', component: ApplicationList },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
