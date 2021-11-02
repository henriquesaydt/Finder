<template>
  <MjModal ref="modal" @close="resetData">
    <div class="flex flex-col space-y-4">
      <InputForm :value.sync="form.senhaAtual" titleClass="font-medium" title="Senha Atual" type="password"/>
      <InputForm :value.sync="form.novaSenha" titleClass="font-medium" title="Nova Senha" type="password"/>
      <InputForm :value.sync="form.novaSenhaRepeat" titleClass="font-medium" title="Repita a senha" type="password"/>
      <div class="flex justify-center space-x-8 pt-4">
        <MjButton @click="$refs.modal.close()" class="font-medium text-lg text-white bg-cyan-900 hover:bg-cyan-800" variant="secondary">
          Cancelar
        </MjButton>
        <MjButton @click="changePassword" class="font-medium text-lg text-white bg-cyan-900 hover:bg-cyan-800" variant="secondary">
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
        senhaAtual: "",
        novaSenha: "",
        novaSenhaRepeat: ""
      }
    }
  },

  methods: {
    resetData() {
      this.form = {
        senhaAtual: "",
        novaSenha: "",
        novaSenhaRepeat: ""
      }
    },

    changePassword() {
      this.$axios.post('/api/auth/change-password', this.form)
      .then(() => {
        this.$root.$emit('toast', ['success', 'Senha alterada com sucesso.']);
        this.$refs.modal.close();
      })
      .catch(() => {
        this.$root.$emit('toast', ['error', 'Ocorreu um erro ao alterar sua senha, por favor, tente novamente']);
      });
    },

    open() {
      this.$refs.modal.open();
    }
  }
}
</script>

<style>

</style>