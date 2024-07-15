<script lang="ts" setup>
import { inject, reactive } from 'vue';
import ContactForm from './ContactForm.vue';
import type { Contact, Store } from '@/types';
const { deleteContact, editContact } = inject('store') as Store;

const props = defineProps({
  contact: { type: Object, default: () => {} }
});

// Связываем реактивный объект с ContactForm
// Передаем его при сохранении изменений в контакте
const contactInputs: Contact = reactive({
  id: props.contact.id || '',
  name: props.contact.name || '',
  number: props.contact.number || '',
  email: props.contact.email || ''
});

// Вызываем функцию после события @on-save которое эмитит ContactForm
const onSave = () => {
  // вызываем метод изменения контакта
  editContact(contactInputs, props.contact.id);
};
</script>

<template>
  <div class="flex flex-col w-full">
    <span class="text-lg font-medium">{{ contact.name }}</span>
    <span class="text-sm text-gray-500">{{ contact.number }}</span>
    <span class="text-sm text-gray-500">{{ contact.email }}</span>
  </div>
  <div class="flex space-x-2 max-sm:flex-col">
    <ContactForm
      v-model:contact-inputs="contactInputs"
      @on-save="onSave"
      title="Редактировать"
      btn-class="px-2 py-1 rounded-md text-blue-500 hover:bg-blue-100 focus:outline-none"
    />

    <button
      @click="deleteContact(contact.id)"
      class="px-2 py-1 rounded-md text-red-500 hover:bg-red-100 focus:outline-none"
    >
      Удалить
    </button>
  </div>
</template>
