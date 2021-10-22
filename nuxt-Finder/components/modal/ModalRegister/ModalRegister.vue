<template>
  <MjModal @close="resetData" ref="modal">
    <!-- Formulario de cadastro de usuario -->
    <div v-if="!modalRegisterContinuar">
      <form class="flex flex-col space-y-3 py-3 lg:w-3/5 lg:mx-auto font-medium">

        <InputForm v-bind:value.sync="registerForm.nome" name="Nome Completo" type="text"/>
        <InputForm v-bind:value.sync="registerForm.nascimento" name="Data de Nascimento" type="date"/>
        <InputForm v-bind:value.sync="registerForm.username" name="Nome de Usuário" type="text"/>
        <InputForm v-bind:value.sync="registerForm.password" name="Senha" type="password"/>
        <InputForm :borderColor="senhaValida?'green':'red'" v-bind:value.sync="registerForm.passwordRepeat" name="Repita a Senha" type="password"/>

        <div class="flex justify-around items-center mt-2">
          <div>
            <button type="button" class="text-white rounded-md px-4 py-2 bg-gray-500" @click="$refs.modal.close()">
              Cancelar
            </button>
          </div>
          <div>
            <button @click="validateForm" type="button" class="text-white rounded-md px-4 py-2" style="background-color: #334259">
              Continuar
            </button>
          </div>
        </div>

      </form>
    </div>
    <!-- Seleção de foto de perfil -->
    <div v-else-if="modalRegisterContinuar">
      <div class="flex flex-col" style="color: #334259">
        <div class="flex justify-between items-center">
          <p class="font-medium text-2xl">
            Escolha sua foto de perfil
          </p>
          <!-- Botão de avançar -->
          <button type="button" @click="captureAvatar">
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
          <button class="rounded-md text-white py-2 px-4 bg-gray-600" @click="resetAvatar">
            Remover Foto
          </button>
          <button class="rounded-md text-white py-2 px-4" @click="$refs.sendPicture.click()" style="background-color: #334259">
            <input class="hidden" type="file" ref="sendPicture" @change="loadImage($event)" accept="image/*">
            Selecionar Foto
          </button>
        </div>
      </div>
    </div>
    <!-- Aviso de erro ao registrar usuário -->
    <ModalAviso @close="$refs.modal.close()" ref="modalErrorRegister" 
      title="Erro ao cadastrar usuário" 
      text="Não foi possível concluir o seu cadastro, por favor, tente novamente mais tarde."
      bg-color-class="bg-red-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="red">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </ModalAviso>
    <!-- Aviso de sucesso ao registrar usuário -->
    <ModalAviso @close="$refs.modal.close()" ref="modalSuccessRegister" 
      title="Cadastro Realizado!" 
      text="Sua conta foi criada com sucesso, você já pode utilizar seu nome de usuário e senha na tela de login."
      bg-color-class="bg-green-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="green">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </ModalAviso>
    <!-- Aviso de erro ao preencher o formulário -->
    <ModalAviso ref="modalErrorForm" 
      title="Dados inválidos!" 
      text="Um ou mais campos não puderam ser validados, por favor, preencha as informações corretamente"
      bg-color-class="bg-red-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="red">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </ModalAviso>
  </MjModal>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import InputForm from './InputForm.vue';

export default {
  data() {
    return {
      registerForm: null,
      modalRegisterContinuar: false,
      registroFinalizado: false,
    }
  },

  computed: {
    senhaValida() {
      if (this.registerForm.password != "" && this.registerForm.password != null && this.registerForm.password == this.registerForm.passwordRepeat) {
        return true;
      }
      else {
        return false;
      }
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
      this.registroFinalizado = false;
    },
    validateForm() {
      if (
        this.registerForm.nome != null && this.registerForm.nome != '' &&
        this.registerForm.nascimento != null && this.registerForm.nome != '' &&
        this.registerForm.username != null && this.registerForm.username != '' &&
        this.senhaValida
      ) {
        this.modalRegisterContinuar = true;
      }
      else {
        this.$refs.modalErrorForm.open();
      }
    },
    async captureAvatar(){
      const form = new FormData();
      function getBlob(canvas) {
        return new Promise(function(resolve, reject) {
          try {
            canvas.toBlob(blob => {
              resolve(blob)
            })
          }
          catch(err) {
            reject(err);
          }
        })
      }
      try {
        const { canvas } = this.$refs.cropper.getResult();
        var blob = await getBlob(canvas);
        form.append('upload', blob)
      }
      catch(err) {
        form.append('upload', null);
      }
      form.append('nome', this.registerForm.nome);
      form.append('nascimento', new Date(this.registerForm.nascimento).toISOString());
      form.append('username', this.registerForm.username);
      form.append('password', this.registerForm.password);
      this.$axios.post('http://localhost:3000/api/register', form)
      .then(() => {
        this.registroFinalizado = true;
        this.$refs.modalSuccessRegister.open();
      })
      .catch(() => {
        this.registroFinalizado = true;
        this.$refs.modalErrorRegister.open();
      });
    },
    resetAvatar() {
      this.registerForm.avatar = {
        src: null,
        type: null
      }
    },
    loadImage(event) {
      this.resetAvatar();
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
      this.$refs.sendPicture.value=null;
		},
  },

  created() {
    this.resetData();
  },

  components: {
    Cropper,
    InputForm,
  }
}
</script>