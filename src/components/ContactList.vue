<script setup>
import ContactItem from './ContactItem.vue';

defineProps({
  contacts: Array
});
</script>

<template>
  <div class="h-screen overflow-y-auto bg-gray-100 p-4 pt-20">
    <TransitionGroup tag="ul" name="fade" class="space-y-2">
      <li
        v-for="contact in contacts"
        :key="contact.id"
        class="flex items-center p-2 rounded-md bg-white shadow border border-gray-200"
      >
        <ContactItem :contact="contact" />
      </li>
    </TransitionGroup>
    <div v-if="!contacts" class="text-xl fixed top-1/2 left-1/2 -translate-x-1/2 text-gray-500">
      Нет контактов
    </div>
  </div>
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>
