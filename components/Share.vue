<template>
  <div>
    <button class="button--blue my-3" @click="toggleShare">
      Share
       <span><font-awesome-icon :icon="['fas', 'share']" /></span>
    </button>
    <div v-if="share" class="hex absolute left-0 top-0 h-full w-full">
      <div
        class="border-3 bg-white sm:w-1/3 w-4/5 shadow-lg p-10 mx-auto mt-32"
      >
        <form @submit="shareLink">
          <input v-model="emails" class="w-full p-3 my-5" placeholder="Email" />
          <button type="submit" class="button--blue my-3">Send</button>
        </form>
        <button type="submit" class="button--green" @click="toggleShare">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Share',
  props: ['id'],
  data() {
    return {
      share: false,
      emails: '',
    }
  },
  methods: {
    async shareLink(e) {
      e.preventDefault()
      console.log(`sharing link`)
      const token = this.$auth.$storage.getUniversal('jwt')
      if (this.$auth.$storage.getUniversal('user') !== null) {
        const recieverEmails = this.emails.split(', ')
        console.log(recieverEmails)

        await this.$axios.$post(
          `/notes/${this.id}/shareLink`,
          {
            sharer: this.$auth.$storage.getUniversal('user').email,
            recievers: recieverEmails,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        this.emails = ''
      } else {
        console.log(`please login to share`)
      }
    },
    toggleShare() {
      this.share = !this.share
    },
  },
}
</script>

<style scoped></style>
