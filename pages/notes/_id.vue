<template>
  <div>
    <Nav />
    <div class="w-4/5 sm:w-2/3 mx-auto">
      <button class="button--blue my-3" @click="toggleAddEditors">
        Add Editor
      </button>

      <NuxtLink :to="`/notes/preview/${res.id}`" class="button--blue">
        Preview
        <span><font-awesome-icon :icon="['fas', 'eye']" /></span>
      </NuxtLink>
      <div
        v-if="addEditor"
        class="absolute hex left-0 top-0 bottom-0 right-0 w-full"
      >
        <div class="bg-white sm:w-1/3 w-4/5 shadow-lg p-10 mx-auto mt-32">
          <p v-if="error" class="text-red-600 my-3">{{ error }}</p>
          <p v-if="success" class="text-green-600 my-3">{{ success }}</p>
          <form @submit="addNewEditor">
            <input
              v-model="editorEmail"
              class="p-5 font-bold w-full border-3 border-black-500"
              type="email"
              placeholder="Email"
            />

            <button type="submit" class="button--blue my-3">Add</button>
          </form>

          <button type="submit" class="button--green" @click="toggleAddEditors">
            Cancel
          </button>
        </div>
      </div>
      <!-- <div>
        <input
          v-model="title"
          class="p-5 font-bold text-4xl w-4/5 border-3 border-black-500"
          type="text"
          :readonly="!isAuthor"
          @change="update()"
        />
        <span> <font-awesome-icon :icon="['fas', 'pen-alt']" /> </span>
      </div> -->

      <div id="toolbar"></div>
      <div
        ref="quill-editor"
        v-quill:myQuillEditor="editorOption"
        class="quill-editor shadow-2xl"
        :content="content"
        @change="onEditorChange($event), update()"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      >
        <form ref="formInput">
          <input
            id="file"
            ref="input"
            name="files"
            class="file"
            type="file"
            style="display: none"
            @change="doUpload"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { ValidationProvider, ValidationObserver } from 'vee-validate'
export default {
  // components: {
  //   ValidationProvider,
  //   ValidationObserver
  // },
  async middleware({ $auth, route, redirect, store, $strapi, $axios }) {
    const token = $auth.$storage.getUniversal('jwt')
    // const note = await $strapi.$notes.findOne(route.params.id)
    const response = await $axios.get(`/notes/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const note = await response.data
    const noteAuthorId = note.users_permissions_user.id
    // console.log('note from middleware', await $strapi.$notes.findOne(route.params.id).users_permissions_user.id)

    if (
      $auth.$storage.getUniversal('user') === null ||
      ($auth.$storage.getUniversal('user').id !== noteAuthorId &&
        note.Editors.findIndex((editor) => {
          return editor.id === $auth.$storage.getUniversal('user').id
        }) === -1)
    ) {
      return redirect(`/notes/preview/${route.params.id}`)
    }
  },
  async asyncData({ $strapi, store, route }) {
    const note = await $strapi.$notes.findOne(route.params.id)
    store.commit('setNote', note)
  },
  data() {
    const self = this
    return {
      res: '',
      error: '',
      isAuthor: '',
      title: '',
      token: this.$auth.$storage.getUniversal(`jwt`),
      content: '',
      addEditor: false,
      editorEmail: '',
      editorOption: {
        // some quill options
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['link'],
              ['blockquote', 'code-block'],
              ['image'],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
              [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
              [{ direction: 'rtl' }], // text direction

              [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],

              ['clean'], // remove formatting button
            ],
            handlers: {
              image() {
                this.quill.format('image', false) // disable the quill internal upload image method
                self.imgHandler(this)
              },
              // link(value) {
              //   this.quill.format('link', false)
              //   // if (value) {
              //   //   const href = prompt('Enter the URL')
              //   //   this.quill.format('link', href)
              //   // } else {
              //   //   this.quill.format('link', false)
              //   // }
              // },
            },
          },
        },
      },
    }
  },
  watch: {
    res(newRes, oldRes) {
      // console.log(newRes.users_permissions_user.id === this.$auth.$storage.getUniversal('user').id)
      if (this.$auth.$storage.getUniversal('user')) {
        this.isAuthor =
          newRes.users_permissions_user.id ===
          this.$auth.$storage.getUniversal('user').id
      }
    },
  },
  created() {
    const res = this.$store.getters.getNote
    console.log('res', res)
    this.title = res.title
    this.res = res
    this.content = res.content ? res.content : ''
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview(file) {
      // console.log(file)
    },
    onEditorBlur(editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      // console.log('editor focus!', editor)
      // console.log('this.quillEditor')
      this.$refs['quill-editor'].firstElementChild
        .getElementsByTagName('h1')
        .forEach((el) => console.log(el.textContent))
    },
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.content = html
    },
    imgHandler(handle) {
      this.quill = handle.quill
      const inputfile = this.$refs.input
      inputfile.click()
    },
    // linkHandler(handle) {
    //   const link =
    //   console.log(link)
    // },
    async doUpload() {
      const file = this.$refs.formInput
      const formdata = new FormData(file) // Create a form object
      // formdata.append(`file.image`, file, file.name)
      console.log(file)
      // const config = {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   // onUploadProgress: progressEvent => {
      //   //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
      //   //   this.progress = complete
      //   // }
      // } // Add request header
      // this.isLoading = true
      if (
        !this.$auth.$storage.getUniversal('user') ||
        this.res.users_permissions_user.id ===
          this.$auth.$storage.getUniversal('user').id
      ) {
        const res = await this.$axios.post(
          `/upload`,
          formdata
          // config
        )
        // this.isLoading = false
        console.log('res', res)
        const { index } = this.quill.getSelection()

        this.quill.insertEmbed(
          index,
          'image',
          `${res.data[0].formats.small.url}`
        )
        console.log(this.content)
      }
    },
    async update() {
      const params = {
        title: this.$refs[
          'quill-editor'
        ].firstElementChild?.getElementsByTagName('h1')[0]?.textContent,
        // publish_time: this.form.publish_time,
        content: this.content,
        // event_id: this.event_id
      }
      console.log('params', params)
      // const res = await this.$strapi.$notes.update(
      //   this.$route.params.id,
      //   params
      // )

      await this.$axios.$put(`/notes/${this.$route.params.id}`, params, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      // if (res.data) {
      //   this.$notify.error({
      //     message: res.data.errorMsg,
      //     Title: 'Error'
      //   })
      // } else {
      //   this.$notify({
      //     message: res.data.errorMsg,
      //     Title: 'success',
      //     type: 'success'
      //   })
      // }
    },
    async addNewEditor(e) {
      e.preventDefault()
      try {
        const [newEditor] = await this.$strapi.$users.find({
          email: this.editorEmail,
        })
        console.log(newEditor)
        const oldEditors = this.res.Editors
        // console.log('exixting editor', oldEditors.findIndex(editor => editor.email === newEditor.email) !== -1)
        if (
          newEditor !== undefined &&
          oldEditors.findIndex((editor) => editor.email === newEditor.email) ===
            -1
        ) {
          const updatedEditors = [...oldEditors, newEditor]
          // call api to send mail
          await this.$axios.$post(
            `/notes/${this.res.id}/addEditors`,
            {
              editorEmail: this.editorEmail,
              noteAuthor: this.$auth.$storage.getUniversal('user').email,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          // update editors in strapi backend
          await this.$axios.$put(
            `/notes/${this.$route.params.id}`,
            {
              Editors: updatedEditors,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          // update editors in store
          this.$store.commit('updateEditors', updatedEditors)
          this.success = `Author added Successfully`
          this.error = ''
        } else {
          this.error = `The user with that email doesn't exist or is already an editor`
          this.success = ''
          console.log(`${this.error}`)
        }
        this.editorEmail = ''
      } catch (e) {
        this.$nuxt.error(e)
      }
    },
    toggleAddEditors() {
      this.addEditor = !this.addEditor
      this.error = ''
      this.success = ''
    },
  },
}
</script>
<style scoped>
.container {
  margin: 0 auto;
  padding: 50px 0;
}

.ql-toolbar span {
  color: #fff;
}
</style>
