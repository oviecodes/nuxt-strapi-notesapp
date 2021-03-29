<template>
  <div>
    <Nav />
    <div class="w-4/5 sm:w-2/3 mx-auto">
      <div class="flex items-center space-x-5">
        <NuxtLink
          v-if="isEditor"
          class="button--green"
          :to="`/notes/${note.id}`"
        >
          Edit
           <span><font-awesome-icon :icon="['fas', 'pen']" /></span>
        </NuxtLink>
        <button
          v-if="!isEditor"
          class="button--green"
          @click="requestEditAccess"
        >
          Request Edit Permissions
        </button>

        <Share :id="note.id" class="z-10" />

        <p class="cursor-pointer" @click="doCopy">
          Copy Link
           <span><font-awesome-icon :icon="['fas', 'copy']" /></span>
        </p>
      </div>

      <!--<h1 class="my-3 text-4xl font-black">{{ note.title }}</h1>-->

      <div
        v-quill:myQuillEditor="editorOption"
        class="quill-editor shadow-2xl"
        :content="note.content"
        @ready="onEditorReady($event)"
        @focus="onEditorFocus($event)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $strapi, route }) {
    const note = await $strapi.$notes.findOne(route.params.id)
    return { note }
  },
  data() {
    return {
      error: '',
      message: 'http://localhost:3000' + this.$route.fullPath,
      token: this.$auth.$storage.getUniversal('jwt'),
      editorOption: {
        modules: {
          toolbar: '',
        },
      },
    }
  },
  computed: {
    isEditor() {
      return (
        this.$auth.$storage.getUniversal('user') !== null &&
        (this.$auth.$storage.getUniversal('user').id ===
          this.note.users_permissions_user.id ||
          this.note.Editors.findIndex((editor) => {
            return editor.id === this.$auth.$storage.getUniversal('user').id
          }) !== -1)
      )
    },
  },
  methods: {
    onEditorReady(editor) {
      editor.disable()
    },
    onEditorFocus(editor) {
      editor.disable()
    },
    assignValue(e) {
      console.log(e.target.value)
      this.recieverEmail = e.target.value
    },
    async requestEditAccess(e) {
      e.preventDefault()
      console.log(`requesting edit access...`)
      if (this.$auth.$storage.getUniversal('user') !== null) {
        await this.$axios.$post(
          `/notes/${this.note.id}/requestEditAccess`,
          {
            noteAuthor: this.note.users_permissions_user.email,
            userEmail: this.$auth.$storage.getUniversal('user').email,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
      } else {
        this.error = 'please login to request access'
        console.log('please login to request access')
      }
    },
    doCopy() {
      this.$copyText(this.message).then(
        function (e) {
          alert('Copied')
        },
        function (e) {
          alert('Can not copy')
        }
      )
    },
  },
}
</script>

<style scoped>
.container {
  width: 60%;
  margin: 0 auto;
  padding: 50px 0;
  background: #fff;
}
</style>
