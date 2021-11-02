<!-- EventoWindow = 0 -->
<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between text-white pl-4 pr-4 space-x-4 pt-4 pb-4">
      <span class="font-medium text-2xl">
        Eventos
      </span>
      <button type="button" @click="newEvento">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
    <div class="flex flex-col space-y-5 p-4 lg:pl-4 2xl:pl-8 pt-0 mt-2 overflow-auto h-full barra">
      <div v-for="evento in listaEventos" :key="evento.id">
        <button class="w-full" @click="eventoSelecionadoID = evento.id; $emit('eventoSelecionado', evento)" type="button">
          <div class="flex space-x-5">
            <div v-show="eventoSelecionadoID == evento.id" class="bg-white w-1">
            </div>
            <div class="flex flex-col items-start text-white">
              <div class="flex items-center">
                <MjStatusDot :status="todosEncontrados(evento.id) ? 'success' : 'warning'"/>
                <span class="font-medium text-lg 2xl:text-xl ml-2 pb-1" style="text-align: left">{{ evento.nome }}</span><br>
              </div>
              <div class="flex">
                <span style="text-align: left">{{ evento.cidade }} - {{ evento.uf }}</span>
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
      eventoSelecionadoID: 0
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
    },

    newEvento() {
      if (this.$auth.loggedIn) {
        this.$emit('eventoWindow', 1);
      }
      else {
        this.$emit('loginWindow');
      }
    }
  },

  async created() {
    this.$axios.get('/api/public/evento')
    .then((res) => {
      this.listaEventos = res.data;
      var listaCoordenadas = [];
      res.data.forEach((evento) => {
        listaCoordenadas.push({
          center: {
            lat: parseInt(evento.localidade_x),
            lng: parseInt(evento.localidade_y)
          },
          radius: evento.localidade_r
        })
      });
      this.$emit('listaCoordenadas', listaCoordenadas);
    })
    .catch((err) => {
      console.log("Não foi possível obter a lista de eventos");
    });
  }
}
</script>

<style scoped>

</style>