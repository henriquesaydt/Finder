<template>
  <nav class="" style="background-color: #334259">
    <div class="flex space-x-10 px-7 py-2 justify-between">
      <!-- LOGO/NOME -->
      <div class="flex items-center space-x-20">
        <a href="#" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-auto" viewBox="0 0 20 20" fill="white">
            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clip-rule="evenodd" />
          </svg>
          <span class="text-white text-5xl font-semibold">
            Finder
          </span>
        </a>

        <div class="hidden md:flex items-center space-x-7 text-2xl font-medium">
          <a href="#" class="text-white border-b-2 border-transparent hover:border-white">
            Início
          </a>
          <a href="#" class="text-white border-b-2 border-transparent hover:border-white">
            Sobre
          </a>
          <a href="#" class="text-white border-b-2 border-transparent hover:border-white">
            Fale Conosco
          </a>
        </div>
      </div>

      <div class="hidden md:flex items-center space-x-20">
        <a href="#" class="flex space-x-4 items-center">
          <span class="text-white text-2xl font-medium">
            Fulano de Tal
          </span>
          <img class=" h-12 w-auto rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
        </a>
      </div>
      
    </div>
  </nav>
</template>

<script>
export default {

}
</script>

<style>

</style>