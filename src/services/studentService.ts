import StudentListInfo from 'src/models/StudentListInfo';
import ApiService from './apiService';
import StudentFormInfo from 'src/models/StudentFormInfo';

export default class StudentService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService('https://localhost:7291/api/students');
  }

  async getStudents(): Promise<StudentListInfo[]> {
    return this.apiService.get<StudentListInfo[]>('');
  }

  async getStudentById(id: number): Promise<StudentFormInfo> {
    return this.apiService.get<StudentFormInfo>(`/${id}`);
  }

  async createStudent(student: StudentFormInfo): Promise<StudentFormInfo> {
    return this.apiService.post<StudentFormInfo>('', student);
  }

  async updateStudent(
    id: number,
    student: StudentFormInfo
  ): Promise<StudentFormInfo> {
    return this.apiService.put<StudentFormInfo>(`/${id}`, student);
  }

  async deleteStudent(id: number): Promise<void> {
    return this.apiService.delete(`/${id}`);
  }
}
