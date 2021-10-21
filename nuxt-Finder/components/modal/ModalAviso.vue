<template>
  <MjModal ref="modal">
    <div class="sm:flex sm:items-start">
      <div :class="'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ' + bgColorClass">
        <span :class="'inline-flex items-center justify-center rounded-full h-10 w-10 p-2 ' + bgColorClass">
          <slot></slot>
        </span>
      </div> 
      <div class="mt-3 sm:mt-0 sm:ml-4">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50 text-center sm:text-left">
          {{ title }}
        </h3> 
        <p class="pt-2 text-gray-800 dark:text-gray-300">
          {{ text }}
        </p>
      </div>
    </div>
    <div class="flex flex-row-reverse mt-7">
      <div>
        <button @click="$refs.modal.close()" class="rounded-md text-white py-2 px-4" style="background-color: #334259">
          Continuar
        </button>
      </div>
    </div>
  </MjModal>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    bgColorClass: String
  },

  methods: {
    open() {
      this.$refs.modal.open();
    },
    close() {
      this.$refs.modal.close();
    }
  }
}
</script>

<style>

</style>