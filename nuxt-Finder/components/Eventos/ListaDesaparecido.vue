<!-- EventoWindow = 2 -->
<template>
  <div class="text-white overflow-auto h-full barra">
    <div class="px-5 pt-5 pb-7">
      <div class="flex flex-col space-y-4">
        <p class="font-medium text-lg">Adicione os indivíduos desaparecidos:</p>
        <MjList divided class="px-4 pb-2 font-medium text-lg space-y-2" style="background-color: #2E4059; min-height: 15rem">
          <MjListItem v-for="desaparecido in desaparecidoList" :key="desaparecido.id" class="pt-2">
            <div class="flex justify-between">
              {{ desaparecido.pessoa.nome }}
              <!-- Botão de remover a pessoa da lista -->
              <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </MjListItem>
          <!-- Botão de adicionar pessoa a lista -->
          <MjListItem>
            <div class="flex pt-2">
              <button @click="$refs.modalNew.$refs.modal.open()" class="flex flex-1 items-center justify-center space-x-2" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                  </svg>
                  <p class="font-medium">Adicionar</p>
              </button>
              <EventosAddDesaparecidoModal ref="modalNew" :eventoId="eventoId" @adicionado="getDesaparecidos"/>
            </div>
          </MjListItem>
        </MjList>
        <div class="flex justify-center space-x-8 pt-5">
          <MjButton @click="eventoAtivo?$emit('eventoWindow', 0):$emit('eventoWindow', 1)" class=" text-base lg:px-2 2xl:px-5" variant="secondary">
            <div class="flex space-x-2 items-center">
              <span>Cancelar</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </MjButton>
          <MjButton @click="checkEvento" class="text-base lg:px-2 2xl:px-5" variant="secondary">
            <div class="flex space-x-2 items-center">
              <span>Finalizar</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </MjButton>
        </div>
      </div>
    </div>
    <MjModal ref="modalConfirma">
      <div class="flex flex-col space-y-4">
        <div class="text-lg font-medium text-cyan-900">
          Deseja finalizar a criação desse evento?
        </div>
        <div class="flex space-x-4 justify-end">
          <MjButton @click="$refs.modalConfirma.close()" class="text-base px-6 bg-cyan-900" variant="secondary">
            <div class="flex space-x-2 items-center text-white">
              <span>Não</span>
            </div>
          </MjButton>
          <MjButton @click="finalizarEvento" class="text-base px-6 bg-cyan-900" variant="secondary">
            <div class="flex space-x-2 items-center text-white">
              <span>Sim</span>
            </div>
          </MjButton>
        </div>
      </div>
    </MjModal>
    <MjToast class="text-cyan-900 text-lg font-medium" ref="toast"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      desaparecidoList: []
    }
  },

  props: {
    eventoId: Number,
    eventoAtivo: Boolean,
  },

  methods: {
    getDesaparecidos() {
      this.$axios.get(`/api/public/desaparecido?eventoId=${this.eventoId}`)
      .then(res => {
        this.desaparecidoList = res.data;
      })
      .catch(err => {
        this.$refs.toast.error('Um erro inesperado ocorreu ao atualizar a lista de desaparecidos, por favor, tente novamente.');
      })
    },
    checkEvento() {
      if (this.desaparecidoList.length > 0) {
        this.$refs.modalConfirma.open()
      }
      else {
        this.$refs.toast.error('Você precisa adicionar ao menos uma pessoa ao evento.');
      }
    },
    finalizarEvento() {
      this.$axios.post('/api/evento/'+this.eventoId)
      .then(() => {
        this.$root.$emit('toast', ['success', 'Evento criado com sucesso.']);
        this.$emit('eventoWindow', 0);
      })
      .catch(() => {
        this.$root.$emit('toast', ['error', 'Ocorreu um erro ao finalizar esse evento, por favor, tente novamente.']);
      });
    }
  },

  created() {
    this.getDesaparecidos();
  }
}
</script>

<style scoped>

</style>