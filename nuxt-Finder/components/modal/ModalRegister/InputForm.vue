<template>
  <div class="flex flex-col space-y-2">
    <p class="text-gray-800">
      {{ name }}
    </p>
    <input @input="$emit('update:value', $event.target.value)" :value="value" :type="type" class=" text-gray-700 border rounded-md leading-tight pl-2 pr-4 py-2 border-gray-300 focus:outline-none focus:border-blue-800">
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    type: String,
    value: String
  }
}
</script>

<style>

</style>