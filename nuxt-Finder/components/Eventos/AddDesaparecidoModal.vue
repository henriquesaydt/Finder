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
            <div v-if="desaparecidoForm.avatar.src == null">
              <MjSkeleton v-if="avatarLoaded==false" rounded class="h-52 w-52"/>
              <img v-show="avatarLoaded" @load="avatarLoaded = true" src="/public/profile-picture/none.png" alt="">
            </div>
            <div v-else>
              <img :src="desaparecidoForm.avatar.src" style="max-height: 270px">
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
      this.desaparecidoForm.avatar = {
        src: null,
        type: null
      }
    },
    resetData() {
      this.desaparecidoForm = {
        nome: null,
        nascimento: null,
        detalhes: null,
        avatar: {
          src: null,
          type: null
        }
      }
    },

    loadImage(event) {
      this.resetAvatar();
			const { files } = event.target;
			if (files && files[0]) {
				if (this.desaparecidoForm.avatar.src) {
					URL.revokeObjectURL(this.desaparecidoForm.avatar.src)
				}
				const blob = URL.createObjectURL(files[0]);
				const reader = new FileReader();
				reader.onload = (e) => {
					this.desaparecidoForm.avatar = {
						src: blob,
					};
				};
				reader.readAsArrayBuffer(files[0]);
			}
      this.$refs.sendPicture.value=null;
		},

    addDesaparecido() {
      
    }
  },

  components: {
    Cropper,
  }
}
</script>

<style>

</style>