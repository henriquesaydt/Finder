<template>
  <MjModal @close="resetData" ref="modal">
    <div v-if="!modalRegisterContinuar">
      <form class="flex flex-col space-y-3 py-3 lg:w-3/5 lg:mx-auto font-medium">

        <InputForm v-bind:value.sync="registerForm.nome" name="Nome Completo" type="text"/>
        <InputForm v-bind:value.sync="registerForm.nascimento" name="Data de Nascimento" type="date"/>
        <InputForm v-bind:value.sync="registerForm.username" name="Nome de Usuário" type="text"/>
        <InputForm v-bind:value.sync="registerForm.password" name="Senha" type="password"/>
        <InputForm v-bind:value.sync="registerForm.passwordRepeat" name="Repita a Senha" type="password"/>

        <div class="flex justify-around items-center mt-2">
          <div>
            <button type="button" class="text-white rounded-md px-4 py-2 bg-gray-500" @click="$refs.modal.close()">
              Cancelar
            </button>
          </div>
          <div>
            <button @click="modalRegisterContinuar = true" type="button" class="text-white rounded-md px-4 py-2" style="background-color: #334259">
              Continuar
            </button>
          </div>
        </div>

      </form>
    </div>
    <div v-else>
      <div class="flex flex-col" style="color: #334259">
        <div class="flex justify-between items-center">
          <p class="font-medium text-2xl">
            Escolha sua foto de perfil
          </p>
          <button type="button" @click="crop">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="#334259">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <div class="flex justify-center">
          <Cropper v-if="registerForm.avatar.src"
            class="my-5"
            ref="cropper"
            :src="registerForm.avatar.src"
            stencil-component="circle-stencil"
            style="max-height:350px; max-width:350px; background-color: white"
          />
          <img v-else src="/public/profile-picture/none.png" alt="">
        </div>
        <div class="flex justify-center space-x-5">
          <button class="rounded-md text-white py-2 px-4 bg-gray-600" @click="reset">
            Remover Foto
          </button>
          <button class="rounded-md text-white py-2 px-4" @click="$refs.sendPicture.click()" style="background-color: #334259">
            <input class="hidden" type="file" ref="sendPicture" @change="loadImage($event)" accept="image/*">
            Enviar Foto
          </button>
        </div>
      </div>
    </div>
  </MjModal>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import InputForm from './InputForm.vue';

export default {
  data() {
    return {
      registerForm: {
        nome: null,
        nascimento: null,
        username: null,
        password: null,
        passwordRepeat: null,
        avatar: {
          src: null,
          type: null
        }
      },
      modalRegisterContinuar: false
    }
  },

  methods: {
    resetData() {
      this.registerForm = {
        nome: null,
        nascimento: null,
        username: null,
        password: null,
        passwordRepeat: null,
        avatar: {
          src: null,
          type: null
        }
      };
      this.modalRegisterContinuar = false;
    },
    crop(){
      const data = new Date('1999-10-02')
      const { canvas } = this.$refs.cropper.getResult();
      canvas.toBlob(blob => {
        const form = new FormData();
        form.append('upload', blob);
        form.append('nome', "Pessoa 1");
        form.append('nascimento', data.toISOString());
        form.append('username', "username1");
        form.append('password', "123");
        this.$axios.post('http://localhost:3000/api/register', form);
      });
    },
    reset() {
			this.registerForm.avatar = {
				src: null,
				type: null
			}
		},
    loadImage(event) {
			const { files } = event.target;
			if (files && files[0]) {
				if (this.registerForm.avatar.src) {
					URL.revokeObjectURL(this.register.avatar.src)
				}
				const blob = URL.createObjectURL(files[0]);
				const reader = new FileReader();
				reader.onload = (e) => {
					this.registerForm.avatar = {
						src: blob,
					};
				};
				reader.readAsArrayBuffer(files[0]);
			}
		},
  },

  destroyed() {
    this.modalRegisterContinuar = false;
  },

  components: {
    Cropper,
    InputForm,
  }
}
</script>