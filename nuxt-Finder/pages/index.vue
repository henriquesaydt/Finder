<template>
    <div class="flex flex-col h-screen" style="background-color:#2E4059">

      <NavbarMain ref="navbar"/>

      <div class="flex pEventosMapa">
        <!-- EVENTOS -->
        <div class="w-5/12 xl:w-4/12 2xl:w-3/12 flex flex-col" style="background-color: #4c5d78;  min-width:19rem;">
          <EventosListaDesaparecido class="h-full" v-if="eventoWindow == 2"
            @eventoWindow="eventoWindow=$event" 
            :eventoId="eventoId"
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
          />
        </div>
        <!-- MAPA -->
        <GoogleMap class="w-full teste" :raio="raioSelected" @positionSelected="positionSelected=$event"/>
      </div>
      <!-- Descrição do Evento -->
      <div v-if="eventoSelecionado" class="flex-none" style="background-color: #2E4059">
        <!-- Cabeçalho -->
        <div class="flex mt-10 mx-10 2xl:mx-20 py-5 rounded-lg text-white font-medium text-2xl" >
          <div class="flex flex-1 justify-between">
            <div class="self-end">
              <p class=" text-4xl mb-3">
                {{ eventoSelecionado.nome }}
              </p>
              <p>
                <span v-if="eventoSelecionado.bairro">{{ eventoSelecionado.bairro }}, </span><span v-if="eventoSelecionado.endereco">{{ eventoSelecionado.endereco }}, </span> {{ eventoSelecionado.cidade }}, {{ eventoSelecionado.uf }}
              </p>
            </div>
            <div class="flex space-x-5 items-end">
              <MjButton class=" text-base pl-3" variant="secondary">
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Adicionar</span>
                </div>
              </MjButton>
              <MjButton class=" text-base pl-3" variant="secondary">
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Editar</span>
                </div>
              </MjButton>
            </div>
          </div>
        </div>
        <hr class="mx-10 2xl:mx-20">
        <!-- Cards de desaparecidos -->
        <div class="grid grid-cols-2 xl:grid-cols-3 gap-10 2xl:p-20 2xl:pt-10 lg:p-10">
          <div v-for="desaparecido in listaDesaparecidos" :key="desaparecido.id" class="flex text-white p-5 rounded-lg space-x-5 items-center cardDesaparecido">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" :src="'/public/desaparecido-picture/'+desaparecido.avatar" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-xl font-medium">
                  {{ desaparecido.pessoa.nome }}<span v-if="desaparecido.pessoa.nascimento">, {{new Date(desaparecido.pessoa.nascimento.getFullYear())}} anos</span>
                </span>
              </div>
              <div>
                <div style="text-align: justify;">
                  {{ desaparecido.detalhes }}
                </div>
              </div>
              <div class="flex space-x-3 items-center">
                <MjStatusDot status="warning"/>
                <span>Situação: Desaparecido à {{ diasDesaparecido(eventoSelecionado.data) }} dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-1 justify-center items-center text-3xl font-medium text-white">
        Selecione um evento para ver os detalhes.
      </div>
      <MjToast class="text-cyan-900 text-lg font-medium" ref="toast"/>
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
    }
  },

  methods: {
    diasDesaparecido(dia) {
      const desaparecimento = new Date(dia);
      const atual = new Date();
      const diff = Math.abs(atual - desaparecimento);
      return Math.round(diff / (1000 * 60 * 60 * 24));
    }
  },

  watch: {
    eventoSelecionado: function (val) {
      this.$axios.get('/api/public/desaparecido?eventoId='+val.id)
      .then((res) => {
        this.listaDesaparecidos = res.data;
        console.log(this.listaDesaparecidos);
      })
      .catch(() => {
        this.$refs.toast.error('Um erro inesperado ocorreu ao carregar o evento, por favor, tente novamente.');
      });
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
    min-height: 33rem;
    max-height: 33rem;
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