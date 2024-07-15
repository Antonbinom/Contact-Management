<script lang="ts" setup>
import { inject, ref, type ModelRef, type Ref } from 'vue';
import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { validatorMessages } from '@/data/messages';
import type { Rules } from 'async-validator';
import type { Contact, Store } from '@/types';
const { getContacts } = inject('store') as Store;

const props = defineProps({
  title: String,
  btnClass: String
});

// Двухстороння связь с родителем
const contactInputs: ModelRef<Contact> = defineModel('contactInputs');
const emit = defineEmits(['on-save']);

const open: Ref<Boolean> = ref(false);
const isFormValid: Ref<Boolean> = ref(true);
const errorMessage: Ref<String> = ref('');

// Правила для валидации
const rules: Rules = {
  name: {
    type: 'string',
    min: 5,
    required: true
  },
  number: {
    type: 'string',
    min: 6,
    required: true
  },
  email: {
    type: 'email',
    required: true
  }
};

const { pass, errorFields } = useAsyncValidator(contactInputs, rules);

// Проверка на существование контакта с одинковым номером или email
function isUserExists(value: string, property: keyof Contact, id?: string) {
  return getContacts.value?.some(
    (contact: Contact) => contact[property] === value && (id ? contact.id !== id : true)
  );
}

function onSave() {
  // Если поля не валидны выделяем поля красным
  if (!pass.value) return (isFormValid.value = false);
  // Выводим сообщение о дубле телефона
  if (isUserExists(contactInputs.value.number, 'number', contactInputs.value.id)) {
    return (errorMessage.value = 'Пользователь с таким телефоном уже существует');
  }
  // Выводим сообщение о дубле email

  if (isUserExists(contactInputs.value.email, 'email', contactInputs.value.id)) {
    return (errorMessage.value = 'Пользователь с такой почтой уже существует');
  }
  // Эмитим событие
  emit('on-save');
  onClose();
}

// Сбрасываем форму и закрываем
function onClose() {
  open.value = false;
  isFormValid.value = true;
  if (props.title === 'Добавить') {
    contactInputs.value.name = '';
    contactInputs.value.number = '';
    contactInputs.value.email = '';
    errorMessage.value = '';
  }
}
</script>

<template>
  <button @click="open = true" :class="btnClass">
    {{ title }}
  </button>
  <Teleport to="body">
    <transition name="fade" appear>
      <div v-if="open" @click="onClose" class="modal-overlay"></div>
    </transition>
    <transition name="pop" appear>
      <div v-if="open" class="modal">
        <h2 class="font-bold text-lg mb-4 text-center">{{ title }} контакт</h2>

        <form @submit.prevent="onSave">
          <div class="mb-2">
            <label for="name" class="block text-gray-700 font-medium mb-2">Имя:</label>
            <input
              type="text"
              id="name"
              v-model="contactInputs.name"
              class="form-input border rounded-md p-2"
              :class="{ 'border-red-500': !isFormValid && errorFields?.name?.length }"
            />
            <span
              class="text-xs text-red-500 capitalize"
              :class="`${!isFormValid && errorFields?.name?.length ? 'visible' : 'invisible'}`"
              >{{ validatorMessages[errorFields?.name?.[0].message] }}</span
            >
          </div>
          <div class="mb-2">
            <label for="number" class="block text-gray-700 font-medium mb-2">Номер телефона:</label>
            <input
              type="tel"
              id="number"
              v-number
              v-model="contactInputs.number"
              class="form-input border rounded-md p-2"
              :class="{ 'border-red-500': !isFormValid && errorFields?.number?.length }"
            />
            <span
              class="text-xs text-red-500 capitalize"
              :class="`${!isFormValid && errorFields?.number?.length ? 'visible' : 'invisible'}`"
              >{{ validatorMessages[errorFields?.number?.[0].message] }}</span
            >
          </div>
          <div class="mb-6">
            <label for="email" class="block text-gray-700 font-medium mb-2">Email:</label>
            <input
              type="email"
              id="email"
              v-model="contactInputs.email"
              class="form-input border rounded-md p-2"
              :class="{ 'border-red-500': !isFormValid && errorFields?.email?.length }"
            />
            <span
              class="text-xs text-red-500 capitalize"
              :class="`${!isFormValid && errorFields?.email?.length ? 'visible' : 'invisible'}`"
              >{{ validatorMessages[errorFields?.email?.[0].message] }}</span
            >
          </div>
          <div v-if="errorMessage" class="text-red-500 my-4 text-center">
            <span class="font-medium">{{ errorMessage }}</span>
          </div>
          <div class="flex justify-between">
            <button type="submit" :class="btnClass">Сохранить</button>
            <button type="button" @click="onClose">Закрыть</button>
          </div>
        </form>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background: #2c3e50;
  opacity: 0.6;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  max-width: 300px;
  height: fit-content;
  margin: auto;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  /* transform: none; */
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.5, 0, 0.5, 1),
    opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
