<template>
  <div>
    <div class="container">
      <NuxtLink v-if="isEditor" :to="`/notes/${note.id}`"> Edit </NuxtLink>
      <button v-if="!isEditor" @click="requestEditAccess">
        Request Edit Permissions
      </button>

      <Share :id='note.id'/>

      {{ note.title }}

      <div
        v-quill="editorOption"
        class="quill-editor"
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
    assignValue(e){
        console.log(e.target.value)
        this.recieverEmail = e.target.value
    },
    async requestEditAccess() {
      console.log(`requesting edit access...`)
      if (this.$auth.$storage.getUniversal('user') !== null) {
        await this.$axios.$post(
          `http://localhost:1337/notes/${this.note.id}/requestEditAccess`,
          {
            noteAuthor: this.note.users_permissions_user.email,
            userEmail: this.$auth.$storage.getUniversal('user').email,
          }
        )
      } else {
        this.error = 'please login to request access'
        console.log('please login to request access')
      }
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
.quill-editor {
  min-height: 200px;
  /* max-height: 400px; */
  padding: 5%;
  overflow-y: auto;
}
img {
  margin: 0 auto;
}
</style>
