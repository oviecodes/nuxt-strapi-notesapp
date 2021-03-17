<template>
  <div
    class="min-h-screen flex justify-center items-center text-center mx-auto sm:pl-24 bg-yellow-200"
  >
    <div class="w-1/2 hidden sm:block m-5 p-6">
      <img src="~assets/undraw_secure_login_pdn4.svg" />
    </div>

    <div class="sm:w-1/2 w-4/5">
      <h2 class="m-5 font-black text-3xl">Social Login</h2>
      <div class="shadow-xl bg-white p-10">
        <!-- <a class="pointer" @click="FacebookLogin">Facebook</a>
        <a class="pointer" @click="TwitterLogin">Twitter</a> -->

        <a
          href="http://localhost:1337/connect/github"
          class="cursor-pointer m-3 button--blue shadow-xl"
        >
          <span><font-awesome-icon :icon="['fab', 'github']" /></span>
          Github
        </a>
        <a class="cursor-pointer m-3 button--blue shadow-xl">
          <span><font-awesome-icon :icon="['fab', 'facebook']" /></span>
          Facebook
        </a>
        <a class="cursor-pointer m-3 button--blue shadow-xl">
          <span><font-awesome-icon :icon="['fab', 'twitter']" /></span>
          Twitter
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>
