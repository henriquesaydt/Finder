<template>
  <MjModal @close="resetData" ref="modal" size="lg" :dismissible="false">
    <form class="space-y-5">
      <div class="flex-none md:flex justify-between">
        <div class="space-y-5 w-full md:w-10/12">
          <InputForm v-bind:value.sync="desaparecidoForm.nome" titleClass="font-medium text-cyan-900" title="Nome" type="text"/>
          <div>
            <span class="font-medium text-cyan-900">Detalhes da pessoa</span>
            <textarea v-model="desaparecidoForm.detalhes" rows="4" class="border focus:border-cyan-900 focus:outline-none rounded-lg text-cyan-900 w-full px-3 py-2 mt-2" style="resize: none"> </textarea>
          </div>
        </div>
        <div class="flex justify-center items-center lg:w-96 md:ml-5 ">
          <button type="button" @click="$refs.sendPicture.click()">
            <div v-if="desaparecidoForm.avatar == null">
              <MjSkeleton v-if="avatarLoaded==false" rounded class="h-52 w-52"/>
              <img v-show="avatarLoaded" @load="avatarLoaded = true" src="/public/profile-picture/none.png" alt="">
            </div>
            <div v-else>
              <img :src="desaparecidoForm.avatar" style="max-height: 270px">
            </div>
            <input class="hidden" type="file" ref="sendPicture" @change="loadImage($event)" accept="image/*">
          </button>
        </div>
      </div>
      <div class="flex justify-center space-x-5">
        <MjButton @click="$refs.modal.close()" class=" text-cyan-900 lg:px-2 2xl:px-5" variant="secondary">
          <div class="flex space-x-2 items-center">
            <span>Cancelar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </MjButton>
        <MjButton @click="addDesaparecido" class=" text-cyan-900 lg:px-2 2xl:px-5" variant="secondary">
          <div class="flex space-x-2 items-center">
            <span>Continuar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </MjButton>
      </div>
    </form>
  </MjModal>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
  data() {
    return {
      desaparecidoForm: null,
      avatarLoaded: false,
    }
  },

  props: {
    eventoId: Number
  },

  created() {
    this.resetData();
    this.avatarLoaded = false;
  },

  methods: {
    resetAvatar() {
      this.desaparecidoForm.avatar = null
    },
    resetData() {
      this.desaparecidoForm = {
        nome: null,
        detalhes: null,
        avatar: null,
        pictureFile: null
      }
    },

    loadImage(event) {
      this.desaparecidoForm.pictureFile = event.target.files[0];
			const { files } = event.target;
			if (files && files[0]) {
				if (this.desaparecidoForm.avatar) {
					URL.revokeObjectURL(this.desaparecidoForm.avatar)
				}
				const blob = URL.createObjectURL(files[0]);
				const reader = new FileReader();
				reader.onload = (e) => {
					this.desaparecidoForm.avatar = blob;
				};
				reader.readAsArrayBuffer(files[0]);
			}
      this.$refs.sendPicture.value=null;
		},

    async addDesaparecido() {
      if (
        this.desaparecidoForm.nome != '' && this.desaparecidoForm.nome != null &&
        this.desaparecidoForm.detalhes != '' && this.desaparecidoForm.detalhes != null
      ) 
      {
        try {
          var resPessoa = await this.$axios.post('/api/pessoa', {
            nome: this.desaparecidoForm.nome
          });
          var resDesaparecido = await this.$axios.post('/api/desaparecido', {
            pessoa_id: resPessoa.data.recurso.id,
            detalhes: this.desaparecidoForm.detalhes,
            eventoId: this.eventoId,
          })
          var formdata = new FormData();
          formdata.append('upload', this.desaparecidoForm.pictureFile);
          var resDesaparecidoPicture = await this.$axios.post('/api/desaparecido/'+resDesaparecido.data.recurso.id+'/picture', 
            formdata
          );
          if (resDesaparecidoPicture) {
            this.$root.$emit('toast', ['success', 'Pessoa adicionada.']);
            this.$emit('adicionado');
            this.$refs.modal.close();
            return;
          }
        }
        catch (err) {}
        this.$root.$emit('toast', ['error', 'Ocorreu um erro ao adicionar essa pessoa, por favor, tente novamente']);
        this.$refs.modal.close();
        return;
      }
      else {
        this.$root.$emit('toast', ['error', 'Por favor, preencha todos os dados']);
      }
    }
  },

  components: {
    Cropper,
  }
}
</script>

<style>

</style>