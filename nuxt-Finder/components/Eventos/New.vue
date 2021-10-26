<template>
  <div class="text-white overflow-auto h-full barra">
    <div class="px-5 pt-3 pb-7 space-y-4">
      <InputForm v-bind:value.sync="eventoForm.nome" titleClass="font-medium" title="Nome do evento *" placeHolder="Ex: Desaparecimento Repentino" type="text"/>
      <InputForm v-bind:value.sync="eventoForm.descricao" titleClass="font-medium" title="Descrição do evento" type="text"/>
      <InputForm v-bind:value.sync="eventoForm.data" titleClass="font-medium" title="Data do ocorrido *" type="date"/>
      <InputForm v-bind:value.sync="eventoForm.cidade" titleClass="font-medium" title="Local do corrido" placeHolder="Cidade *" type="text"/>
      <InputForm v-bind:value.sync="eventoForm.bairro" titleClass="font-medium" placeHolder="Bairro" type="text"/>
      <InputForm v-bind:value.sync="eventoForm.endereco" titleClass="font-medium" placeHolder="Logradouro" type="text"/>
      <div>
        <span class="font-medium">Clique no mapa para selecionar a área aproximada, em seguida, escolha o alcance do evento</span>
        <input class="w-full" @input="$emit('raio', $event.target.value)" v-model="raioSelected" type="range" min="1000" max="100000">
      </div>
      <div class="flex justify-center space-x-8">
        <MjButton @click="$emit('cancelNewEvento')" class=" text-base lg:px-2 2xl:px-5" variant="secondary">
          <div class="flex space-x-2 items-center">
            <span>Cancelar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </MjButton>
        <MjButton class="text-base lg:px-2 2xl:px-5" variant="secondary">
          <div class="flex space-x-2 items-center">
            <span>Continuar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </MjButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventoForm: null,
      raioSelected: null
    }
  },

  methods: {
    resetData() {
      this.eventoForm = {
        nome: "",
        descricao: "",
        data: "",
        endereco: "",
        bairro: "",
        cidade: "",
      }
    }
  },

  created() {
    this.resetData();
  }
}
</script>

<style scoped>
  .barra::-webkit-scrollbar {
    width: 18px;
  }

  .barra::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .barra::-webkit-scrollbar-thumb {
    border-radius: 100px;
    border: 5px solid transparent;
    background-clip: content-box;
    background-color: #27374d;
  }

  .barra {
    scrollbar-color: #27374d transparent;
    scrollbar-width: auto;
  }
</style>