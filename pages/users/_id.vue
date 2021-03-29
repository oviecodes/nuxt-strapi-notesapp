<template>
  <div>
    <Nav/>
    <div class="sm:w-2/3 w-4/5 mt-10 mx-auto">
      <button class="button--blue" @click="createNewNote">Create Note</button>
      <h1 class="my-5 text-2xl font-black">Your Notes</h1>
      <div v-if="notes" class="mx-auto sm:grid grid-cols-3 gap-2">
        <div
          v-for="(note, i) in notes"
          :key="i"
          class="rounded border-5 border-blue-400 p-10 sm:flex shadow-lg h-48 items-center justify-center text-center"
        >
        <NuxtLink :to="`/notes/${note.id}`">
          <h1 class="text-xl">
            {{ note.title }}
          </h1>
        </NuxtLink>
        
        </div>
      </div>
      <infinite-loading  spinner="spiral" @infinite="infiniteHandler" />
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $strapi, route, $axios, $auth }) {
    const user = await $axios.$get(`/users/${ route.params.id }`, {
      headers: {
        Authorization: `Bearer ${ $auth.$storage.getUniversal('jwt') }`
      }
    })
    const notes = await $strapi.$notes.find({
      'users_permissions_user.id': route.params.id,
      _sort: `published_at:DESC`,
      _start: `0`,
      _limit: `3`
    })
    return { notes, user }
  },
  data() {
    return {
      title: `New Note`,
      content: `<p>Start Writing</p>`,
      start: 3,
      limit: 3,
      token: this.$auth.$storage.getUniversal('jwt')
    }
  },
  methods: {
    async createNewNote() {
      const newNote = await this.$axios.$post(`/notes`, {
        title: this.title,
        content: this.content,
        users_permissions_user: this.user,
        Editors: [],
      },
      {
        headers: {
          Authorization: `Bearer ${ this.token }`
        }
      }
      )
      console.log(newNote)
      this.$router.push(`/notes/${newNote.id}`)
    },
    async infiniteHandler($state) {
      const newData = await this.$strapi.$notes.find({
        'users_permissions_user.id': this.$route.params.id,
        _sort: `published_at:DESC`,
        _start: `${this.start}`,
        _limit: `${this.limit}`
      })
      if(newData.length) {
        this.start += this.limit
        this.notes.push(...newData)
        $state.loaded()
      } else {
        $state.complete()
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
