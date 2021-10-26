<template>
  <div>
    <div class="flex items-center justify-between text-white pl-4 pr-4 space-x-4 pt-4 pb-4">
      <span class="font-medium text-xl">
        Eventos
      </span>
      <button type="button" @click="$emit('newEvento')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <div class="flex flex-col space-y-5 p-4 lg:pl-4 2xl:pl-8 pt-0 mt-2 overflow-auto h-full barra">
      <div v-for="evento in listaEventos" :key="evento.id">
        <button type="button">
          <div class="flex space-x-5">
            <div v-show="eventoSelecionadoID == evento.id" class="bg-white w-1">
            </div>
            <div class="flex flex-col items-start text-white">
              <div class="flex items-center">
                <MjStatusDot :status="todosEncontrados(evento.id) ? 'success' : 'warning'"/>
                <span class="font-medium text-lg 2xl:text-xl ml-2 pb-1" style="text-align: left">{{ evento.nome }}</span><br>
              </div>
              <div class="flex">
                <span style="text-align: left">{{ evento.bairro }}, {{ evento.endereco }} - {{ evento.cidade }} - {{ evento.uf }}</span>
              </div>
              <div>
                Desaparecidos: {{ evento.desaparecidos.length }}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listaEventos: [],
      eventoSelecionadoID: 1
    }
  },

  methods: {
    todosEncontrados(eventoID) {
      var encontrados = true;
      const evento = this.listaEventos.find(evento => {
        return evento.id == eventoID;
      });
      evento.desaparecidos.forEach(desaparecido => {
        if (desaparecido.encontrado == false) {
          encontrados = false;
          return;
        }
      });
      return encontrados
    }
  },

  async created() {
    this.$axios.get('/api/public/evento')
    .then((res) => {
      this.listaEventos = res.data;
    })
    .catch((err) => {
      console.log("Não foi possível obter a lista de eventos");
    });
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