<template>
  <div class="w-4/5 mx-auto">
    <h1 class="my-3">Welcome {{ user.username }}</h1>
    <p class="button--blue" @click="createNewNote">Create Note</p>
    <h1 class="my-10 text-2xl font-black">Your Notes</h1>
    <div class="mx-auto">
      <div
        v-for="(note, i) in notes"
        :key="i"
        class="m-3 rounded border-5 border-blue-400 p-10 sm:flex shadow-lg"
      >
        <NuxtLink :to="`/notes/${note.id}`">{{ note.title }}</NuxtLink>
      </div>
    </div>
    <infinite-loading  spinner="spiral" @infinite="infiniteHandler">
      <div slot="no-more">That's all</div>
    </infinite-loading>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  async asyncData({ $strapi, route }) {
    const user = await $strapi.$users.findOne(route.params.id)
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
      // user: Cookies.getJSON('user'),
      title: `New Note`,
      content: `<p>Start Writing</p>`,
      start: 3,
      limit: 3,
    }
  },
  methods: {
    async createNewNote() {
      const newNote = await this.$strapi.$notes.create({
        title: this.title,
        content: this.content,
        users_permissions_user: this.user,
        Editors: [],
      })
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
        console.log(this.start)
      } else {
        $state.complete()
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
