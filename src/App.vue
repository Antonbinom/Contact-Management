<script setup lang="ts">
import { inject, reactive } from 'vue';
import ContactForm from './components/ContactForm.vue';
import ContactList from './components/ContactList.vue';
import SearchBar from './components/SearchBar.vue';
import type { Contact, Store } from './types';

const { getContacts, createContact } = inject('store') as Store;

// Связываем реактивный объект с ContactForm
// Передаем его при сохранении создании контакта
const contactInputs = reactive({
  id: '',
  name: '',
  number: '',
  email: ''
}) as Contact;

// Вызываем функцию после события @on-save которое эмитит ContactForm
const onSave = () => {
  // Формируем объект с контактом
  const contactData = {
    id: Math.random().toString(36).substring(2, 9),
    name: contactInputs.name,
    number: contactInputs.number,
    email: contactInputs.email
  };
  // Вызываем функцию создающую новый контакт на основе объекта
  createContact(contactData);
};
</script>

<template>
  <header
    class="flex items-center justify-between w-full bg-gray-800 p-4 fixed"
    style="max-width: inherit"
  >
    <SearchBar />
    <ContactForm
      v-model:contact-inputs="contactInputs"
      @on-save="onSave"
      title="Добавить"
      btn-class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
    />
  </header>

  <main>
    <ContactList :contacts="getContacts" />
  </main>
</template>
