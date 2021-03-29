<template>
  <div class="p-6 mb-4 shadow-lg bg-dark">

    <div class="sm:w-2/3 mx-auto flex justify-between items-center">
        <div>
            <h1> NotesApp </h1>
        </div>
        <div class="flex sm:space-x-5 space-x-2 items-center">
            <NuxtLink :to="`/users/${userId}`">
             <p v-if="username"><span><font-awesome-icon :icon="['fas', 'user']" /></span> {{ username }}</p>
            </NuxtLink>
            <button class="button--blue" @click="logout" v-if="username" > Logout </button>
            <button class="button--green" v-if="!username" > Sign in </button>
        </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data() {
    return {
      username: this.$auth.$storage.getUniversal('user')?.username,
      userId: this.$auth.$storage.getUniversal('user')?.id
    }
  },
  methods: {
    logout() {
      this.$auth.$storage.removeUniversal('user')
      this.$auth.$storage.removeUniversal('jwt')
      this.$router.push(`/login`)
    },
  },
}
</script>

<style scoped></style>
