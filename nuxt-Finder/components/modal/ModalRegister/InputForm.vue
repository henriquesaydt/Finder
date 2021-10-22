<template>
  <div class="flex flex-col space-y-2">
    <p class="text-gray-800">
      {{ name }}
    </p>
    <input @input="$emit('update:value', $event.target.value)" :value="value" :type="type" :class="'text-gray-700 rounded-md leading-tight pl-2 pr-4 py-2 focus:outline-none ' + borderColorClass">
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    type: String,
    value: String,
    borderColor: String,
  },
  computed: {
    borderColorClass() {
      if (this.borderColor != "" && this.borderColor != null) {
        return "border-2 border-"+ this.borderColor +"-800"
      }
      else {
        return "border border-gray-300 focus:border-blue-800"
      }
    }
  }
}
</script>

<style>

</style>