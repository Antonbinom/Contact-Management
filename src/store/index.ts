import { computed, reactive } from 'vue';
import { useDebounceFn, useStorage } from '@vueuse/core';
import type { Contact } from '@/types';

// Замена хранилища
// Подключаем к приложению с помощью provide
// Получаем в нужном нам компоненте с помощью inject
const state: { contacts: Contact[]; searchValue: string } = reactive({
  // Используя VueUse - useStorage - создаем реактивное состояние связанное с localStorage.
  contacts: useStorage('contacts', []),
  searchValue: ''
});

// Возвращает отфильтрованный по имени массив с контактами
const getContacts = computed(() => {
  if (!state.contacts.length) return;
  return (
    state.contacts
      .filter((contact: Contact) => {
        return contact.name.toLowerCase().includes(state.searchValue.toLowerCase());
      })
      // Разварачиваем массив. Последний сверху
      .reverse()
  );
});

// Добавляем новый контакт
function createContact(obj: Contact) {
  state.contacts.push(obj);
}

// Удаляем контакт по id
function deleteContact(id: string) {
  state.contacts = state.contacts.filter((contact: Contact) => contact.id !== id);
}
// Редактируем контакт полностью заменяя заменяя объект на новый
function editContact(obj: Contact, id: string) {
  const contactIndex = state.contacts.findIndex((contact: Contact) => contact.id === id);
  state.contacts[contactIndex] = obj;
}
// Изменяем значение поисковой строки. Debounce с помощью VueUse - useDebounceFn
const setSearchValue = useDebounceFn((event) => {
  state.searchValue = event.target.value;
}, 500);

export default {
  state,
  getContacts,
  createContact,
  deleteContact,
  editContact,
  setSearchValue
};
