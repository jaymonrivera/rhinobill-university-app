<template>
  <q-page>
    <div>
      <div class="button-container">
        <q-btn icon="add" label="Add" color="primary" @click="addStudent" />
      </div>
    </div>

    <q-table :rows="students" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            label="Edit"
            color="primary"
            @click="editStudent(props.row.id)"
          />
          <q-btn
            flat
            label="Delete"
            color="red"
            @click="deleteStudent(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <!--  Modal -->
    <q-dialog v-model="formDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ formDialogText }} Student</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="formData.firstName"
            label="First Name"
            :disable="formInputDisabled"
          />
          <q-input
            v-model="formData.lastName"
            label="Last Name"
            :disable="formInputDisabled"
          />
          <q-input
            v-model="formData.dateOfBirth"
            label="Date of Birth"
            :disable="formInputDisabled"
          >
            <template v-slot:append>
              <q-icon name="event" />
            </template>
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="formData.dateOfBirth" />
            </q-popup-proxy>
          </q-input>
          <q-input
            v-model="formData.email"
            label="Email"
            :disable="formInputDisabled"
          />
          <q-input
            v-model="formData.phoneNumber"
            label="Phone Number"
            :disable="formInputDisabled"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            :label="formSaveButtonText"
            color="primary"
            @click="saveStudent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import StudentFormInfo from 'src/models/StudentFormInfo';
import {} from 'date-fns';
import StudentService from 'src/services/studentService';
export default defineComponent({
  name: 'StudentList',
  setup() {
    const students = ref<StudentFormInfo[]>([]);
    const formDialog = ref(false);
    const formDialogText = ref('');
    const formInputDisabled = ref(false);
    const formSaveButtonText = ref('Save');
    const formData = ref<StudentFormInfo>({} as StudentFormInfo);
    const studentService = new StudentService();

    const columns = [
      { name: 'firstName', label: 'First Name', field: 'firstName' },
      { name: 'lastName', label: 'Last Name', field: 'lastName' },
      { name: 'email', label: 'Email', field: 'email' },
      { name: 'phoneNumber', label: 'Phone Number', field: 'phoneNumber' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false },
    ];

    const defaultData = {
      id: 0,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phoneNumber: '',
    } as StudentFormInfo;

    const cancelForm = () => {
      formDialog.value = false;
    };

    const fetchStudents = async () => {
      try {
        const response = await studentService.getStudents();
        students.value = response;
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchStudentById = async (id: number) => {
      try {
        const response = await studentService.getStudentById(id);
        const student = response;
        return student;
      } catch (error) {
        console.error('Failed to fetch student:', error);
        return undefined;
      }
    };

    const editStudent = async (id: number) => {
      formDialogText.value = 'Edit';
      formSaveButtonText.value = 'Save';
      formInputDisabled.value = false;

      const student = await fetchStudentById(id);
      if (student) {
        formData.value = { ...student };
        formDialog.value = true;
      }
    };

    const deleteStudent = async (id: number) => {
      formDialogText.value = 'Delete';
      formSaveButtonText.value = 'Delete';
      formInputDisabled.value = true;
      const student = await fetchStudentById(id);
      if (student) {
        formData.value = { ...student };
        formDialog.value = true;
      }
    };

    const addStudent = () => {
      formDialogText.value = 'Add';
      formSaveButtonText.value = 'Save';
      formInputDisabled.value = false;
      formDialog.value = true;
      formData.value = { ...defaultData };
    };

    const saveStudent = async () => {
      try {
        if (formDialogText.value == 'Edit') {
          await studentService.updateStudent(formData.value.id, formData.value);
        } else if (formDialogText.value == 'Delete') {
          await studentService.deleteStudent(formData.value.id);
        } else if (formDialogText.value == 'Add') {
          await studentService.createStudent(formData.value);
        }

        formDialog.value = false;

        fetchStudents();
      } catch (error) {
        console.error('Error saving student:', error);
      }
    };

    onMounted(fetchStudents);

    return {
      students,
      columns,
      formDialog,
      formData,
      editStudent,
      saveStudent,
      deleteStudent,
      formDialogText,
      formInputDisabled,
      addStudent,
      formSaveButtonText,
      cancelForm,
    };
  },
});
</script>
