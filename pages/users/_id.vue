<template>
  <div>
    <h1>Welcome {{ user.username }}</h1>
    <p @click="createNewNote">Create Note</p>
    <h3>Your Notes</h3>
    <div v-for="(note, i) in notes" :key="i">
      <NuxtLink :to="`/notes/${note.id}`">{{ note.title }}</NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $auth, $strapi }) {
    const userId = $auth.$storage.getUniversal('user').id
    const notes = await $strapi.$notes.find({
      'users_permissions_user.id': userId,
    })
    return { notes }
  },
  data() {
    return {
      user: this.$auth.$storage.getUniversal('user'),
      title: `New Note`,
      content: `<p>Start Writing</p>`,
    }
  },
  methods: {
    async createNewNote() {
      const newNote = await this.$strapi.$notes.create({
        title: this.title,
        content: this.content,
        users_permissions_user: this.user,
      })
      console.log(newNote)
      this.$router.push(`/notes/${newNote.id}`)
    },
  },
}
</script>

<style lang="scss" scoped></style>
