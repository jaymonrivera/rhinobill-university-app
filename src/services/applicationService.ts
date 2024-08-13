import AppplicationSummaryInfo from 'src/models/ApplicationSummaryInfo';
import ApiService from './apiService';
import ApplicationFormInfo from 'src/models/ApplicationFormInfo';

export default class ApplicationService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService('https://localhost:7291/api/applications');
  }

  async getApplications(): Promise<AppplicationSummaryInfo[]> {
    return this.apiService.get<AppplicationSummaryInfo[]>('');
  }

  async getApplicationById(id: number): Promise<ApplicationFormInfo> {
    return this.apiService.get<ApplicationFormInfo>(`/${id}`);
  }

  async createApplication(
    application: ApplicationFormInfo
  ): Promise<ApplicationFormInfo> {
    return this.apiService.post<ApplicationFormInfo>('', application);
  }

  async updateApplication(
    id: number,
    application: ApplicationFormInfo
  ): Promise<ApplicationFormInfo> {
    return this.apiService.put<ApplicationFormInfo>(`/${id}`, application);
  }

  async deleteApplication(id: number): Promise<void> {
    return this.apiService.delete(`/${id}`);
  }
}
