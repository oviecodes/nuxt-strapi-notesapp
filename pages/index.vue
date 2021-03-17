<template>
  <div
    class="min-h-screen flex justify-center items-center text-center mx-auto sm:pl-24 bg-yellow-200"
  >
    <div class="w-1/2 sm:text-left sm:m-5">
      <div>
        <h1
          class="text-3xl sm:text-6xl font-black sm:pr-10 leading-tight text-blue-900"
        >
          Welcome to the NoteApp
        </h1>
        <p class="sm:block hidden my-5">
          Your number one notes sharing application
          <br />
          Share your notes with anybody across the globe
        </p>
      </div>
      <div class="links">
        <NuxtLink to="/login" class="button--blue shadow-xl"> Login </NuxtLink>
      </div>
    </div>
    <div class="w-1/2 hidden sm:block">
      <img
        class=""
        src="~assets/undraw_Sharing_articles_re_jnkp.svg"
      />
      <!--<img src="https://images.unsplash.com/photo-1615360509352-92a352aa73f7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" /> -->
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
