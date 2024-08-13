<template>
  <q-page>
    <div>
      <div class="button-container">
        <q-btn icon="add" label="Add" color="primary" @click="addCourse" />
      </div>
    </div>

    <q-table :rows="courses" :columns="columns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            label="Edit"
            color="primary"
            @click="editCourse(props.row.id)"
          />
          <q-btn
            flat
            label="Delete"
            color="red"
            @click="deleteCourse(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <!--  Modal -->
    <q-dialog v-model="formDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ formDialogText }} Course</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="formData.code"
            label="Code"
            :disable="formInputDisabled"
          />
          <q-input
            v-model="formData.title"
            label="Title"
            :disable="formInputDisabled"
          />

          <q-input
            v-model.number="formData.credits"
            label="Credits"
            :disable="formInputDisabled"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            :label="formSaveButtonText"
            color="primary"
            @click="saveCourse"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import CourseFormInfo from 'src/models/CourseFormInfo';
import {} from 'date-fns';
import CourseService from 'src/services/courseService';
import CourseListInfo from 'src/models/CourseListInfo';
export default defineComponent({
  name: 'CourseList',
  setup() {
    const courses = ref<CourseListInfo[]>([]);
    const formDialog = ref(false);
    const formDialogText = ref('');
    const formInputDisabled = ref(false);
    const formSaveButtonText = ref('Save');
    const formData = ref<CourseFormInfo>({} as CourseFormInfo);
    const courseService = new CourseService();

    const columns = [
      { name: 'code', label: 'Code', field: 'code' },
      { name: 'title', label: 'Title', field: 'title' },
      { name: 'credits', label: 'Credits', field: 'credits' },
      { name: 'actions', label: 'Actions', field: 'actions', sortable: false },
    ];

    const defaultData = {
      id: 0,
      code: '',
      title: '',
      credits: 0,
    } as CourseFormInfo;

    const cancelForm = () => {
      formDialog.value = false;
    };

    const fetchCourses = async () => {
      try {
        const response = await courseService.getCourses();
        courses.value = response;
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchCourseById = async (id: number) => {
      try {
        const response = await courseService.getCourseById(id);
        const course = response;
        return course;
      } catch (error) {
        console.error('Failed to fetch course:', error);
        return undefined;
      }
    };

    const editCourse = async (id: number) => {
      formDialogText.value = 'Edit';
      formSaveButtonText.value = 'Save';
      formInputDisabled.value = false;

      const course = await fetchCourseById(id);
      if (course) {
        formData.value = { ...course };
        formDialog.value = true;
      }
    };

    const deleteCourse = async (id: number) => {
      formDialogText.value = 'Delete';
      formSaveButtonText.value = 'Delete';
      formInputDisabled.value = true;
      const course = await fetchCourseById(id);
      if (course) {
        formData.value = { ...course };
        formData.value.id = id;
        formDialog.value = true;
      }
    };

    const addCourse = () => {
      formDialogText.value = 'Add';
      formSaveButtonText.value = 'Save';
      formInputDisabled.value = false;
      formDialog.value = true;
      formData.value = { ...defaultData };
    };

    const saveCourse = async () => {
      try {
        if (formDialogText.value == 'Edit') {
          await courseService.updateCourse(formData.value.id, formData.value);
        } else if (formDialogText.value == 'Delete') {
          await courseService.deleteCourse(formData.value.id);
        } else if (formDialogText.value == 'Add') {
          await courseService.createCourse(formData.value);
        }

        formDialog.value = false;

        fetchCourses();
      } catch (error) {
        console.error('Error saving course:', error);
      }
    };

    onMounted(fetchCourses);

    return {
      courses,
      columns,
      formDialog,
      formData,
      addCourse,
      editCourse,
      saveCourse,
      deleteCourse,
      formDialogText,
      formInputDisabled,

      formSaveButtonText,
      cancelForm,
    };
  },
});
</script>
