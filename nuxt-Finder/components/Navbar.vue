<template>
  <nav class="p-1" style="background-color: #334259">
    <div class="flex space-x-10 px-7 py-2 justify-between">
      <!-- LOGO/NOME -->
      <div class="flex space-x-20">
        <a href="#">
          <div class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-auto" viewBox="0 0 20 20" fill="white">
              <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clip-rule="evenodd" />
            </svg>
            <span class="text-white text-5xl font-semibold">
              Finder
            </span>
          </div>
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

      <MjPopover class=" hidden" align="right">
        <div class="hidden md:flex items-center space-x-20">
          <button href="#" class="flex space-x-4 items-center">
            <span class="text-white text-2xl font-medium">
              Fulano de Tal
            </span>
            <img class=" h-12 w-auto rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
          </button>
        </div>
        <template #content>
          <MjPopoverContainer class="p-2 sm:w-48">
            <MjPopoverItem class="hover:bg-gray-200">Meu perfil</MjPopoverItem>
            <MjDivider class="my-2" />
            <MjPopoverItem class="hover:bg-gray-200">Alterar Senha</MjPopoverItem>
            <MjPopoverItem class="hover:bg-gray-200">Sair</MjPopoverItem>
          </MjPopoverContainer>
        </template>
      </MjPopover>

      <button class=" rounded-lg bg-white text-grey-800 font-medium px-5 text-lg" @click="$refs.modalLogin.open()">
        Login
      </button>

      <MjModal ref="modalLogin" class="">
        <form class="flex flex-col space-y-3 py-3 lg:w-3/4 lg:mx-auto grid gap-4 font-medium">
          <div class="flex flex-col space-y-2">
            <p class="text-gray-800">
              Usuário
            </p>
            <input type="text" class=" text-gray-700 border rounded-md leading-tight pl-2 pr-4 py-2 border-gray-300 focus:outline-none focus:border-blue-800">
          </div>

          <div class="flex flex-col space-y-2">
            <p class="text-gray-800">
              Senha
            </p>
            <input type="text" class=" text-gray-700 border rounded-md leading-tight pl-2 pr-4 py-2 border-gray-300 focus:outline-none focus:border-blue-800">
          </div>

          <div class="flex items-center mt-2">
            <div class="flex-1">
              <MjLink href="#" class="text-gray-800 hover:text-blue-900">
                Esqueci Minha Senha
              </MjLink>
            </div>
            <div>
              <button class="text-white rounded-md px-4 py-2" style="background-color: #334259">
                Login
              </button>
            </div>
          </div>
        </form>
      </MjModal>
      
    </div>
  </nav>
</template>

<script>
export default {

}
</script>

<style>

</style>