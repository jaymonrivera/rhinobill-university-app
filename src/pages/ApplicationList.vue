<template>
  <q-page>
    <div>
      <div class="button-container">
        <q-btn icon="add" label="Add" color="primary" @click="addApplication" />
      </div>
    </div>

    <q-table :rows="applications" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            label="Edit"
            color="primary"
            @click="editApplication(props.row.id)"
          />
          <q-btn
            flat
            label="Delete"
            color="red"
            @click="deleteApplication(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <!--  Modal -->
    <q-dialog v-model="formDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ formDialogText }} Application</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="selectedStudent"
            :options="students"
            label="Student"
            :disable="formInputDisabled"
            option-label="fullName"
            option-value="id"
          />

          <q-select
            v-model="selectedCourse"
            :options="courses"
            label="Course"
            :disable="formInputDisabled"
            option-label="codeAndTitle"
            option-value="id"
          />

          <q-input
            v-model="formData.applicationDate"
            label="Application Date"
            :disable="formInputDisabled"
          >
            <template v-slot:append>
              <q-icon name="event" />
            </template>
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="formData.applicationDate" />
            </q-popup-proxy>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            :label="formSaveButtonText"
            color="primary"
            @click="saveApplication"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {} from 'date-fns';
import ApplicationService from 'src/services/applicationService';
import AppplicationSummaryInfo from 'src/models/ApplicationSummaryInfo';
import ApplicationFormInfo from 'src/models/ApplicationFormInfo';
import CourseService from 'src/services/courseService';
import StudentService from 'src/services/studentService';
import StudentListInfo from 'src/models/StudentListInfo';
import CourseListInfo from 'src/models/CourseListInfo';
export default defineComponent({
  name: 'ApplicationList',
  setup() {
    const applications = ref<AppplicationSummaryInfo[]>([]);
    const formDialog = ref(false);
    const formDialogText = ref('');
    const formInputDisabled = ref(false);
    const formSaveButtonText = ref('Save');
    const formData = ref<ApplicationFormInfo>({} as ApplicationFormInfo);
    const applicationService = new ApplicationService();
    const students = ref<StudentListInfo[]>([]);
    const courses = ref<CourseListInfo[]>([]);
    const courseService = new CourseService();
    const studentService = new StudentService();
    const selectedStudent = ref<StudentListInfo>();
    const selectedCourse = ref<CourseListInfo>();
    //const selectedCourseId = ref<StudentListInfo | 0>(0);
    const columns = [
      {
        name: 'applicationDate',
        label: 'Application Date',
        field: 'applicationDate',
      },
      { name: 'studentName', label: 'Student', field: 'studentName' },
      { name: 'course', label: 'Course', field: 'course' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false },
    ];

    const defaultData = {
      id: 0,
      studentId: 0,
      courseId: 0,
      applicationDate: '',
    } as ApplicationFormInfo;

    const cancelForm = () => {
      formDialog.value = false;
    };

    const fetchApplications = async () => {
      try {
        const response = await applicationService.getApplications();
        applications.value = response;
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await studentService.getStudents();
        students.value = response;
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await courseService.getCourses();
        courses.value = response;
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchApplicationById = async (id: number) => {
      try {
        const response = await applicationService.getApplicationById(id);
        const application = response;

        selectedStudent.value = students.value.find(
          (student) => student.id === application.studentId
        );
        selectedCourse.value = courses.value.find(
          (course) => course.id === application.courseId
        );

        return application;
      } catch (error) {
        console.error('Failed to fetch application:', error);
        return undefined;
      }
    };

    const editApplication = async (id: number) => {
      formDialogText.value = 'Edit';
      formSaveButtonText.value = 'Save';
      formInputDisabled.value = false;

      const application = await fetchApplicationById(id);
      if (application) {
        formData.value = { ...application };

        formDialog.value = true;
      }
    };

    const deleteApplication = async (id: number) => {
      formDialogText.value = 'Delete';
      formSaveButtonText.value = 'Delete';
      formInputDisabled.value = true;
      const application = await fetchApplicationById(id);
      if (application) {
        formData.value = { ...application };
        formDialog.value = true;
      }
    };

    const addApplication = () => {
      formDialogText.value = 'Add';
      formSaveButtonText.value = 'Save';
      formInputDisabled.value = false;
      formDialog.value = true;
      selectedCourse.value = undefined;
      selectedStudent.value = undefined;
      formData.value = { ...defaultData };
    };

    const saveApplication = async () => {
      const student = selectedStudent.value;
      const course = selectedCourse.value;

      formData.value.studentId = student?.id ?? 0;
      formData.value.courseId = course?.id ?? 0;

      try {
        if (formDialogText.value == 'Edit') {
          await applicationService.updateApplication(
            formData.value.id,
            formData.value
          );
        } else if (formDialogText.value == 'Delete') {
          await applicationService.deleteApplication(formData.value.id);
        } else if (formDialogText.value == 'Add') {
          await applicationService.createApplication(formData.value);
        }

        formDialog.value = false;

        fetchApplications();
      } catch (error) {
        console.error('Error saving application:', error);
      }
    };

    onMounted(() => {
      fetchApplications();
      fetchStudents();
      fetchCourses();
    });

    return {
      applications: applications,
      columns,
      formDialog,
      formData,
      addApplication,
      editApplication,
      saveApplication,
      deleteApplication,
      formDialogText,
      formInputDisabled,
      formSaveButtonText,
      cancelForm,
      courses,
      students,
      selectedStudent,
      selectedCourse,
    };
  },
});
</script>
