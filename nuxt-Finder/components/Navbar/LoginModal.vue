<template>
  <div>
    <MjModal @close="login.username=''; login.password=''" ref="modal">
      <form @submit.prevent="userLogin" class="flex flex-col space-y-7 py-3 lg:w-3/5 lg:mx-auto font-medium">
        <div class="flex flex-col space-y-2">
          <p class="text-gray-800">
            Usuário
          </p>
          <input v-model="login.username" type="text" class=" text-gray-700 border rounded-md leading-tight pl-2 pr-4 py-2 border-gray-300 focus:outline-none focus:border-blue-800">
        </div>

        <div class="flex flex-col space-y-2">
          <p class="text-gray-800">
            Senha
          </p>
          <input v-model="login.password" type="password" class=" text-gray-700 border rounded-md leading-tight pl-2 pr-4 py-2 border-gray-300 focus:outline-none focus:border-blue-800">
        </div>

        <div class="flex items-center mt-2">
          <div class="flex-1">
            <MjLink href="#" class="text-gray-800 hover:text-blue-900">
              Esqueci Minha Senha
            </MjLink>
          </div>
          <div>
            <button type="submit" class="text-white rounded-md px-4 py-2" style="background-color: #334259">
              Login
            </button>
          </div>
        </div>

        <div class="flex justify-center">
          <span>Não possui uma conta?</span>
          <button type="button" class="text-blue-700 font-medium hover:text-blue-500 ml-2" @click="$emit('register')" >Registre-se</button>
        </div>
      </form>
    </MjModal>
    <MjToast ref="toast" class="font-medium"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        username: '', 
        password: ''
      },
    }
  },

  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith('local', { data: this.login });
        if (response) {
          this.$refs.modal.close();
        }
      } catch (err) {
        this.$refs.toast.error('Usuário ou senha incorretos.');
      }
    },
  }
}
</script>

<style>

</style>