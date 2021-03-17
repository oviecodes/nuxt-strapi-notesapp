<template>
  <div>
    <button>Share</button>
    <div>
      <form @submit="shareLink">
        <input v-model='emails' placeholder="Email" />
        <button type="submit">send</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Share',
  props: ['id'],
  data() {
    return {
      emails: '',
    }
  },
  methods: {
    async shareLink(e) {
      e.preventDefault()
      console.log(`sharing link`)
      
      const recieverEmails = this.emails.split(', ')
      console.log(recieverEmails)
      
      await this.$axios.$post(
        `http://localhost:1337/notes/${this.id}/shareLink`,
        {
          sharer: this.$auth.$storage.getUniversal('user').email,
          recievers: recieverEmails,
        }
      )
    },
  },
}
</script>

<style scoped></style>
