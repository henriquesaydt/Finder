<template>
  <MjModal ref="modal" @close="resetData">
    <div class="flex flex-col space-y-4">
      <div>
        <span class="font-medium text-cyan-900">Onde foi encontrado</span>
        <textarea v-model="form.localizacao" rows="4" class="border focus:border-cyan-900 focus:outline-none rounded-lg text-cyan-900 w-full px-3 py-2 mt-2" style="resize: none"> </textarea>
      </div>
      <div>
        <span class="font-medium text-cyan-900">Estado da vítima</span>
        <textarea v-model="form.estado" rows="4" class="border focus:border-cyan-900 focus:outline-none rounded-lg text-cyan-900 w-full px-3 py-2 mt-2" style="resize: none"> </textarea>
      </div>
      <div class="flex justify-center space-x-8 pt-4">
        <MjButton @click="$refs.modal.close()" class="font-medium text-lg text-white bg-cyan-900 hover:bg-cyan-800" variant="secondary">
          Cancelar
        </MjButton>
        <MjButton @click="confirma" class="font-medium text-lg text-white bg-cyan-900 hover:bg-cyan-800" variant="secondary">
          Continuar
        </MjButton>
      </div>
    </div>
  </MjModal>
</template>

<script>
export default {
  data() {
    return {
      form: {
        localizacao: "",
        estado: "",
        desaparecidoId: null
      },
    }
  },

  methods: {
    resetData() {
      this.form = {
        localizacao: "",
        estado: "",
        desaparecidoId: null
      }
    },

    encontrado(id) {
      this.$refs.modal.open();
      this.form.desaparecidoId = id;
    },

    confirma() {
      try {
        this.$axios.post('/api/public/encontrado', this.form)
        .then(() => {
          this.$root.$emit('toast', ['success', 'Localização e situação registradas com sucesso']);
          this.$emit('encontrado');
          this.$refs.modal.close();
        })
      } 
      catch (err) {
        this.$root.$emit('toast', ['error', 'Ocorreu um erro ao localizar essa pessoa, por favor tente novamente']);
      }
    }
  }
}
</script>

<style>

</style>