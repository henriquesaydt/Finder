<template>
  <div class="flex flex-col space-y-2">
    <p :class="titleClass">
      {{ title }}
    </p>
    <input @input="$emit('update:value', $event.target.value)" :value="value" :type="type" :placeholder="placeHolder" :class="' text-gray-600 rounded-md leading-tight pl-2 pr-4 py-2 focus:outline-none ' + borderColorClass">
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    type: String,
    value: String,
    borderColor: String,
    placeHolder: String,
    titleClass: String,
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