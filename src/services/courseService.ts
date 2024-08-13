import CourseListInfo from 'src/models/CourseListInfo';
import ApiService from './apiService';
import CourseFormInfo from 'src/models/CourseFormInfo';

export default class CourseService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService('https://localhost:7291/api/courses');
  }

  async getCourses(): Promise<CourseListInfo[]> {
    return this.apiService.get<CourseListInfo[]>('');
  }

  async getCourseById(id: number): Promise<CourseFormInfo> {
    return this.apiService.get<CourseFormInfo>(`/${id}`);
  }

  async createCourse(course: CourseFormInfo): Promise<CourseFormInfo> {
    return this.apiService.post<CourseFormInfo>('', course);
  }

  async updateCourse(
    id: number,
    course: CourseFormInfo
  ): Promise<CourseFormInfo> {
    return this.apiService.put<CourseFormInfo>(`/${id}`, course);
  }

  async deleteCourse(id: number): Promise<void> {
    return this.apiService.delete(`/${id}`);
  }
}
