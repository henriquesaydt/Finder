<template>
  <div class="flex flex-col h-screen" style="background-color:#2E4059">

    <NavbarMain ref="navbar" 
      @eventoWindow="eventoWindow=$event" 
      @eventoSelecionado="eventoSelecionado=$event"
    />

    <div class="flex pEventosMapa">
      <!-- EVENTOS -->
      <div class="w-full md:w-72 xl:w-80 2xl:w-96 flex flex-col" style="background-color: #4c5d78;  min-width:19rem;">
        <EventosListaDesaparecido class="h-full" v-if="eventoWindow == 2"
          @eventoWindow="eventoWindow=$event" 
          :eventoId="eventoId"
          :eventoAtivo="eventoSelecionado.ativo"
        />
        <EventosNew class="h-full" v-else-if="eventoWindow == 1" 
          @eventoWindow="eventoWindow=$event" 
          @raio="raioSelected=$event" 
          @eventoId="eventoId=$event"
          :positionSelected="positionSelected" 
        />
        <EventosMain class="h-full" v-else 
          @eventoWindow="eventoWindow=$event" 
          @loginWindow="$refs.navbar.loginWindow()"
          @eventoSelecionado="eventoSelecionado=$event"
          @listaCoordenadas="listaCoordenadas=$event"
        />
      </div>
      <!-- MAPA -->
      <div class="hidden md:flex flex-1">
        <GoogleMap ref="mapa" class="w-full h-full" 
          :editing="editingMap"
          :raio="raioSelected"
          :listaCoordenadas="listaCoordenadas"
          @positionSelected="positionSelected=$event"
        />
      </div>
      
    </div>
    <!-- Descrição do Evento -->
    <div v-if="eventoSelecionado" class="flex-none" style="background-color: #2E4059">
      <!-- Cabeçalho -->
      <div class="flex-row mt-3 md:mt-10 mx-5 md:mx-10 2xl:mx-20 py-5 rounded-lg text-white font-medium text-2xl" >
        <div class="flex flex-col md:flex-row space-y-4 flex-1 justify-between">
          <div class="">
            <p class="text-2xl md:text-4xl mb-3">
              {{ eventoSelecionado.nome }}
            </p>
            <p class="text-lg md:text-2xl">
              <span v-if="eventoSelecionado.bairro">{{ eventoSelecionado.bairro }}, </span><span v-if="eventoSelecionado.endereco">{{ eventoSelecionado.endereco }}, </span> {{ eventoSelecionado.cidade }}, {{ eventoSelecionado.uf }}
            </p>
          </div>
          <div class="flex space-x-5 items-end">
            <MjButton @click="eventoId=eventoSelecionado.id;eventoWindow=2" class="w-full md:w-auto text-base pl-3" variant="secondary">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Adicionar</span>
              </div>
            </MjButton>
            <!--
            <MjButton @click="eventoId=eventoSelecionado.id;eventoWindow=1" class=" text-base pl-3" variant="secondary">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Editar</span>
              </div>
            </MjButton>
            -->
          </div>
        </div>
      </div>
      <hr class="mx-5 lg:mx-10 2xl:mx-20">
      <!-- Cards de desaparecidos -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 2xl:pt-10 p-5 lg:p-10 2xl:p-20 pb-10">
        <div v-for="desaparecido in listaDesaparecidos" :key="desaparecido.id" class="flex flex-col rounded-lg cardDesaparecido outline-none">
          <div class="flex flex-1 text-white p-5 space-x-5 items-center">
            <img class="w-16 h-16 md:w-24 md:h-24 rounded-full ring-2 ring-white" style="object-fit: cover;" :src="'/public/desaparecido-picture/'+desaparecido.avatar" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-lg md:text-xl font-medium">
                  {{ desaparecido.pessoa.nome }}<span v-if="desaparecido.pessoa.nascimento">, {{new Date(desaparecido.pessoa.nascimento.getFullYear())}} anos</span>
                </span>
              </div>
              <div>
                <div style="text-align: justify;">
                  {{ desaparecido.detalhes }}
                </div>
              </div>
              <div class="flex space-x-3 items-center">
                <div>
                  <MjStatusDot :status="desaparecido.encontrado ? 'success' : 'warning'"/>
                </div>
                <span v-if="!desaparecido.encontrado">Situação: Desaparecido à {{ diasDesaparecido(eventoSelecionado.data) }} dias</span>
                <span v-else>Encontrado</span>
              </div>
            </div>
          </div>
          <div v-show="!desaparecido.encontrado" class="text-white flex justify-center items-center px-5 pb-5">
            <MjButton @click="$refs.modalEncontrado.encontrado(desaparecido.id)" class="w-full md:w-auto text-base pl-3" variant="secondary">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Encontrado</span>
              </div>
            </MjButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-1 justify-center items-center px-10 md:px-0 text-lg md:text-3xl font-medium text-white">
      Selecione um evento para ver os detalhes.
    </div>
    <MjToast class="text-cyan-900 text-lg font-medium" ref="toast"/>
    <ModalEncontrado @encontrado="getDesaparecidos" ref="modalEncontrado"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventoId: null,
      eventoWindow: 0,
      eventoSelecionado: null,
      listaDesaparecidos: [],
      windowAddDesaparecido: false,
      windowNewEvento: false,
      raioSelected: 50000,
      positionSelected: {
        lat: null,
        lng: null
      },
      listaCoordenadas: []
    }
  },

  computed: {
    editingMap() {
      if (this.eventoWindow == 1) {
        return true;
      }
      else {
        return false;
      }
    }
  },

  methods: {
    diasDesaparecido(dia) {
      const desaparecimento = new Date(dia);
      const atual = new Date();
      const diff = Math.abs(atual - desaparecimento);
      return Math.round(diff / (1000 * 60 * 60 * 24));
    },

    getDesaparecidos() {
      this.$axios.get('/api/public/desaparecido?eventoId='+this.eventoSelecionado.id)
      .then((res) => {
        this.listaDesaparecidos = res.data;
      })
      .catch(() => {
        this.$refs.toast.error('Um erro inesperado ocorreu ao carregar o evento, por favor, tente novamente.');
      });
    }
  },

  watch: {
    eventoSelecionado: function (val) {
      if (val) {
        this.getDesaparecidos();
      }
    }
  },

  created() {
    this.$root.$on('toast', event => {
      if (event[0] == "error") {
        this.$refs.toast.error(event[1]);
      }
      else {
        this.$refs.toast.success(event[1]);
      }
    })
  }
}
</script>

<style scoped>
  .cardDesaparecido {
    background-color: #46638c
  }

  .pEventosMapa {
    min-height: 27rem;
    max-height: 27rem;
  }

  @media (min-width: 768px) {
    .pEventosMapa {
      min-height: 33rem;
      max-height: 33rem;
    }
  }

  @media (min-width: 1536px) {
    .pEventosMapa {
      min-height: 42rem;
      max-height: 42rem;
    }
  }
  
</style>

<style>
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