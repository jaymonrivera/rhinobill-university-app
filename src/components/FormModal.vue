<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <p>{{ content }}</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="cancel" />
        <q-btn flat label="Confirm" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'SimpleModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  emits: ['update:visible', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const isVisible = ref(props.visible);

    watch(
      () => props.visible,
      (newValue) => {
        alert('');
        isVisible.value = newValue;
      }
    );

    const cancel = () => {
      emit('update:visible', false);
      emit('cancel');
    };

    const confirm = () => {
      emit('confirm');
      emit('update:visible', false);
    };

    return {
      isVisible,
      cancel,
      confirm,
    };
  },
});
</script>

<style scoped>
/* Add any styles specific to this component */
</style>
