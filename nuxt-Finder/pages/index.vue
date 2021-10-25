<template>
    <div class="flex flex-col h-screen">

      <Navbar/>

      <div class="flex pEventosMapa">
        <!-- EVENTOS -->
        <Eventos />
        <!-- MAPA -->
        <GoogleMap class="w-full teste"/>
      </div>

      <!-- Descrição do Evento -->
      <div class="flex-none" style="background-color: #2E4059">
        <!-- Cabeçalho -->
        <div class="flex mt-10 mx-20 py-5 rounded-lg text-white font-medium text-2xl" >
          <div class="flex flex-1 justify-between">
            <div class="self-end">
              <span>
                Evento Tal - Centro, Marechal Floriano, Espirito Santo
              </span>
            </div>
            <div class="flex space-x-5">
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
        <hr class="mx-20">
        <!-- Cards de desaparecidos -->
        <div class="grid grid-cols-3 gap-10 2xl:p-20 2xl:pt-10 lg:p-10">
          <div class="flex text-white p-5 rounded-lg space-x-5 items-center cardDesaparecido">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://previews.123rf.com/images/dolgachov/dolgachov1603/dolgachov160306114/54057828-business-people-and-portrait-concept-smiling-businessman-face-or-portrait.jpg" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-xl font-medium">
                  João Paulo, 30 anos
                </span>
              </div>
              <div>
                <span>
                  Visto por último: Centro Marechal Floriano asdas das das dasd as dasd asdas 
                </span>
              </div>
              <div class="flex space-x-3 items-center">
                <MjStatusDot status="warning"/>
                <span>Situação: Desaparecido à 5 dias</span>
              </div>
            </div>
          </div>
          <div class="flex text-white p-5 rounded-lg space-x-5 items-center cardDesaparecido">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://previews.123rf.com/images/dolgachov/dolgachov1603/dolgachov160306114/54057828-business-people-and-portrait-concept-smiling-businessman-face-or-portrait.jpg" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-xl font-medium">
                  João Paulo, 30 anos
                </span>
              </div>
              <div>
                <span>
                  Visto por último: Centro Marechal Floriano asdas das das dasd as dasd asdas 
                </span>
              </div>
              <div class="flex space-x-3 items-center">
                <MjStatusDot status="warning"/>
                <span>Situação: Desaparecido à 5 dias</span>
              </div>
            </div>
          </div><div class="flex text-white p-5 rounded-lg space-x-5 items-center cardDesaparecido">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://previews.123rf.com/images/dolgachov/dolgachov1603/dolgachov160306114/54057828-business-people-and-portrait-concept-smiling-businessman-face-or-portrait.jpg" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-xl font-medium">
                  João Paulo, 30 anos
                </span>
              </div>
              <div>
                <span>
                  Visto por último: Centro Marechal Floriano asdas das das dasd as dasd asdas 
                </span>
              </div>
              <div class="flex space-x-3 items-center">
                <MjStatusDot status="warning"/>
                <span>Situação: Desaparecido à 5 dias</span>
              </div>
            </div>
          </div>
          <div class="flex text-white p-5 rounded-lg space-x-5 items-center cardDesaparecido">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://previews.123rf.com/images/dolgachov/dolgachov1603/dolgachov160306114/54057828-business-people-and-portrait-concept-smiling-businessman-face-or-portrait.jpg" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-xl font-medium">
                  João Paulo, 30 anos
                </span>
              </div>
              <div>
                <span>
                  Visto por último: Centro Marechal Floriano asdas das das dasd as dasd asdas 
                </span>
              </div>
              <div class="flex space-x-3 items-center">
                <MjStatusDot status="warning"/>
                <span>Situação: Desaparecido à 5 dias</span>
              </div>
            </div>
          </div>
          <div class="flex text-white p-5 rounded-lg space-x-5 items-center cardDesaparecido">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://previews.123rf.com/images/dolgachov/dolgachov1603/dolgachov160306114/54057828-business-people-and-portrait-concept-smiling-businessman-face-or-portrait.jpg" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-xl font-medium">
                  João Paulo, 30 anos
                </span>
              </div>
              <div>
                <span>
                  Visto por último: Centro Marechal Floriano asdas das das dasd as dasd asdas 
                </span>
              </div>
              <div class="flex space-x-3 items-center">
                <MjStatusDot status="warning"/>
                <span>Situação: Desaparecido à 5 dias</span>
              </div>
            </div>
          </div>
          <div class="flex text-white p-5 rounded-lg space-x-5 items-center cardDesaparecido">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://previews.123rf.com/images/dolgachov/dolgachov1603/dolgachov160306114/54057828-business-people-and-portrait-concept-smiling-businessman-face-or-portrait.jpg" alt="" />
            <div class="flex flex-col justify-between space-y-2">
              <div>
                <span class="text-xl font-medium">
                  João Paulo, 30 anos
                </span>
              </div>
              <div>
                <span>
                  Visto por último: Centro Marechal Floriano asdas das das dasd as dasd asdas 
                </span>
              </div>
              <div class="flex space-x-3 items-center">
                <MjStatusDot status="warning"/>
                <span>Situação: Desaparecido à 5 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  
}
</script>

<style scoped>
  .cardDesaparecido {
    background-color: #46638c
  }

  .pEventosMapa {
    min-height: 33rem;
  }

  @media (min-width: 1536px) {
    .pEventosMapa {
      min-height: 45rem;
    }
  }
  
</style>