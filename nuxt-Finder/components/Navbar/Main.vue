<template>
  <nav class="p-1" style="background-color: #334259">
    <div class="flex space-x-10 px-2 md:px-7 py-2 justify-between">
      <!-- LOGO/NOME -->
      <div class="flex space-x-20">
        <a class="flex items-center" href="/">
          <div class="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-9 lg:h-12 w-auto" viewBox="0 0 20 20" fill="white">
              <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clip-rule="evenodd" />
            </svg>
            <span class="text-white text-3xl lg:text-5xl font-semibold">
              Finder
            </span>
          </div>
        </a>

        <div class="hidden md:flex items-center space-x-7 text-xl lg:text-2xl font-medium">
          <NuxtLink class="text-white border-b-2 border-transparent hover:border-white" to="/" @click="$emit('eventoSelecionado', null); $emit('eventoWindow', 0)">Início</NuxtLink>
          <NuxtLink class="text-white border-b-2 border-transparent hover:border-white" to="/about">Sobre</NuxtLink>
          <NuxtLink class="text-white border-b-2 border-transparent hover:border-white" to="/contato">Contato</NuxtLink>
        </div>
      </div>

      <MjPopover v-if="$auth.loggedIn" align="right">
        <div class="hidden md:flex items-center space-x-20">
          <button href="#" class="flex space-x-4 items-center">
            <span class="text-white text-xl lg:text-2xl font-medium">
              {{ $auth.user.nome }}
            </span>
            <img class=" h-12 w-auto rounded-full ring-2 ring-white" :src="'/public/profile-picture/' + $auth.user.avatar" alt="" />
          </button>
        </div>
        <template #content>
          <MjPopoverContainer class="p-2 sm:w-48">
            <!--
            <MjPopoverItem class="hover:bg-gray-200">Meu perfil</MjPopoverItem>
            <MjDivider class="my-2" />
            -->
            <MjPopoverItem @click="$refs.modalSenha.open()" class="hover:bg-gray-200">Alterar Senha</MjPopoverItem>
            <MjPopoverItem @click="userLogout" class="hover:bg-gray-200">Sair</MjPopoverItem>
          </MjPopoverContainer>
        </template>
      </MjPopover>

      <MjButton v-else class="text-white" variant="secondary" @click="loginWindow">
        Login
      </MjButton>
      
    </div>

    <NavbarLoginModal ref="modalLogin" @register="$refs.modalLogin.$refs.modal.close(); $refs.modalRegister.$refs.modal.open()"/>

    <NavbarRegisterModal ref="modalRegister"/>

    <NavbarUserSenha ref="modalSenha"/>

  </nav>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  data() {
    return {
      register: {
        avatar: {
          src: null,
          type: null
        }
      },
      modalRegisterContinuar: false
    }
  },

  methods: {
    loginWindow() {
      this.$refs.modalLogin.$refs.modal.open();
    },

    async userLogout() {
      try {
        let response = await this.$auth.logout();
      }
      catch (err) {
        console.log(err);
      }
    },
    crop(){
      const { canvas } = this.$refs.cropper.getResult();
      canvas.toBlob(blob => {
        const form = new FormData();
        form.append('upload', blob)
        this.$axios.post('http://localhost:3000/api/public/profile-picture', form);
      });
    },
    reset() {
			this.register.avatar = {
				src: null,
				type: null
			}
		},
    loadImage(event) {
			const { files } = event.target;
			if (files && files[0]) {
				if (this.register.avatar.src) {
					URL.revokeObjectURL(this.register.avatar.src)
				}
				const blob = URL.createObjectURL(files[0]);
				const reader = new FileReader();
				reader.onload = (e) => {
					this.register.avatar = {
						src: blob,
					};
				};
				reader.readAsArrayBuffer(files[0]);
			}
		},
  },

  components: {
    Cropper,
  }
}
</script>

<style scoped>

</style>