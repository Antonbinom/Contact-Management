<script lang="ts" setup>
import type { Store } from '@/types';
import { inject } from 'vue';
const { state, setSearchValue } = inject('store') as Store;
// Здесь мы взаимодействуем только со Store
</script>

<template>
  <div class="flex flex-grow mr-4">
    <input
      class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :value="state.searchValue"
      @input="setSearchValue"
      placeholder="Поиск контактов"
      type="text"
    />
  </div>
</template>
