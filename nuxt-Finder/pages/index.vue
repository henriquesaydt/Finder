<template>
    <div class="flex flex-col h-screen">

      <Navbar/>

      <div class="flex">
        <!-- EVENTOS -->
        <!-- COR: #4c5d78 -->
        <div class=" w-3/12 flex flex-col" style="background-color: #4c5d78; height: 40rem">
          <div class="flex items-center text-white pl-4 space-x-4 pt-4 pb-4">
            <span class="font-medium text-xl">
              Eventos
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex flex-col space-y-5 p-4 pl-10 pt-0 overflow-auto h-full barra">
            <div class="text-gray-400">
              <a href="#">
                <div>
                  <span class="font-medium">DESABAMENTO</span><br>
                  <span>Centro - Marechal Floriano - ES</span><br>
                  <span>2 Desaparecidos</span>
                </div>
              </a>
            </div>
            <div class="text-white">
              <a href="#">
                <div>
                  <span class="font-medium">DESABAMENTO</span><br>
                  <span>Centro - Marechal Floriano - ES</span><br>
                  <span>2 Desaparecidos</span>
                </div>
              </a>
            </div>
            <div v-for="i in 8" :key="i" class="text-gray-400">
              <a href="#">
                <div>
                  <span class="font-medium">Enchente {{ i }}</span><br>
                  <span>Centro - Marechal Floriano - ES</span><br>
                  <span>2 Desaparecidos</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <!-- MAPA -->
        <GoogleMap class="w-full "/>
      </div>

      <!-- Descrição do Evento -->
      <div class="h-96 flex-none" style="background-color: #2E4059">

        <div class="grid grid-cols-3 gap-10 p-20">

          <div class="flex text-white p-5 rounded-lg space-x-5 items-center" style="background-color: #4E6D99">
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
              <div>
                <span>Situação: Desaparecido à 5 dias</span>
              </div>
            </div>
          </div>
          <div class=" text-white p-5 rounded-lg" style="background-color: #4E6D99">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://images-na.ssl-images-amazon.com/images/I/81pUGmwTnRL.png" alt="" />
          </div>
          <div class=" text-white p-5 rounded-lg" style="background-color: #4E6D99">
            <img class=" h-24 w-24 rounded-full ring-2 ring-white" style="object-fit: cover;" src="https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" alt="" />
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