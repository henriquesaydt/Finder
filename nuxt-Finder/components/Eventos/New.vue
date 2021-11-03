<!-- EventoWindow = 1 -->
<template>
  <div class="text-white overflow-auto h-full barra">
    <div class="px-5 pt-3 pb-7 space-y-4">
      <InputForm v-bind:value.sync="eventoForm.nome" titleClass="font-medium" title="Nome do evento *" placeHolder="Ex: Desaparecimento do ..." type="text"/>
      <InputForm v-bind:value.sync="eventoForm.descricao" titleClass="font-medium" title="Descrição do evento *" type="text"/>
      <InputForm v-bind:value.sync="eventoForm.data" titleClass="font-medium" title="Data do ocorrido *" type="date"/>
      <InputForm v-bind:value.sync="eventoForm.cidade" titleClass="font-medium" title="Local do corrido" placeHolder="Cidade *" type="text"/>
      <InputForm v-bind:value.sync="eventoForm.bairro" titleClass="font-medium" placeHolder="Bairro" type="text"/>
      <InputForm v-bind:value.sync="eventoForm.endereco" titleClass="font-medium" placeHolder="Logradouro" type="text"/>
      <div class="pt-2">
        <select v-model="eventoForm.uf" class="text-cyan-900 w-full appearance-none outline-none rounded-md p-2 leading-tight">
          <option :value="null" selected disabled>Selecione o Estado *</option>
          <option v-for="uf in UFList" :key="uf[1]" :value="uf[1]">{{ uf[0] }}</option>
        </select>
      </div>
      <div>
        <span class="font-medium">Clique no mapa para selecionar a área aproximada, em seguida, escolha o alcance do evento</span>
        <input class="w-full" @input="$emit('raio', parseInt($event.target.value))" v-model="eventoForm.localidade_r" type="range" min="1000" max="100000">
      </div>
      <div class="flex justify-center space-x-8">
        <MjButton @click="$emit('eventoWindow', 0)" class=" text-base lg:px-2 2xl:px-5" variant="secondary">
          <div class="flex space-x-2 items-center">
            <span>Cancelar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </MjButton>
        <MjButton @click="createEvento()" class="text-base lg:px-2 2xl:px-5" variant="secondary">
          <div class="flex space-x-2 items-center">
            <span>Continuar</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </MjButton>
        <!-- Aviso de erro ao preencher o formulário -->
        <ModalAviso ref="modalErrorForm" 
          title="Preencha os campos obrigatórios" 
          text="Um ou mais campos obrigatários não puderam ser validados, os campos obrigatórios são marcados com *"
          bg-color-class="bg-red-100"
        >
          <MjStatusIcon status="error" />
        </ModalAviso>
        <MjToast class="text-cyan-900 text-lg font-medium" ref="toast"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventoForm: null,
      UFList: [
        ['Acre', 'AC'],
        ['Alagoas', 'AL'],
        ['Amapá', 'AP'],
        ['Amazonas', 'AM'],
        ['Bahia', 'BA'],
        ['Ceará', 'CE'],
        ['Espírito Santo', 'ES'],
        ['Goiás', 'GO'],
        ['Maranhão', 'NA'],
        ['Mato Grosso', 'MT'],
        ['Mato Grosso do Sul', 'MS'],
        ['Minas Gerais', 'MG'],
        ['Pará', 'PA'],
        ['Paraíba', 'PB'],
        ['Paraná', 'PR'],
        ['Pernambuco', 'PE'],
        ['Piauí', 'PI'],
        ['Rio de Janeiro', 'RJ'],
        ['Rio Grande do Norte', 'RN'],
        ['Rio Grande do Sul', 'RS'],
        ['Rondônia', 'RO'],
        ['Roraima', 'RR'],
        ['Santa Catarina', 'SC'],
        ['São Paulo', 'SP'],
        ['Sergipe', 'SE'],
        ['Tocantins', 'TO'],
        ['Distrito Federal', 'DF'],
      ]
    }
  },

  props: {
    positionSelected: Object
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
        uf: null,
        localidade_x: "",
        localidade_y: "",
        localidade_r: 50000,
      }
    },

    createEvento() {
      if (this.formValid()) {
        this.eventoForm.localidade_r = parseInt(this.eventoForm.localidade_r);
        this.eventoForm.data = new Date(this.eventoForm.data).toISOString();
        this.$axios.post('/api/evento', this.eventoForm)
        .then(res => {
          this.$emit('eventoId', res.data.recurso.id);
          this.$emit('eventoWindow', 2);
        })
        .catch(err => {
          this.$refs.toast.error('Um erro inesperado ocorreu ao criar o evento, por favor, tente novamente.')
        })
      }
      else {
        this.$refs.modalErrorForm.open();
      }
    },

    formValid() {
      if (this.positionSelected) {
        this.eventoForm.localidade_x = this.positionSelected.lat.toString();;
        this.eventoForm.localidade_y = this.positionSelected.lng.toString();;
      }
      console.log(this.eventoForm);
      var isValid = true;
      const requiredFields = ['nome', 'descricao', 'data', 'cidade', 'uf'];
      for (let field of requiredFields) {
        if (this.eventoForm[field] == null || this.eventoForm[field] == '') {
          isValid = false;
          break;
        }
        else {
          continue;
        }
      }
      return isValid;
    },

    editing() {
      console.log("aki");
    }
  },

  created() {
    this.resetData();
  }
}
</script>

<style scoped>

</style>