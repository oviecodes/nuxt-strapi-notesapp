<template>

  <section>
    <NuxtLink :to="`/notes/preview/${res.id}`">
      Preview
    </NuxtLink>
    <div>
      <input
        v-model="title"
        type="text"
        :readonly="!isAuthor"
        @change="update()"
      />
    </div>

    <div id="toolbar"></div>
    <div
      v-quill:myQuillEditor="editorOption"
      class="quill-editor"
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
  </section>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  data() {
    const self = this
    return {
      res: '',
      isAuthor: '',
      title: '',
      content: '',
      editorOption: {
        // some quill options
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],
              ['link', 'image'],

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
            },
          },
        },
      },
    }
  },
  watch: {
    res(newRes, oldRes) {
      //console.log(newRes.users_permissions_user.id === this.$auth.$storage.getUniversal('user').id)
      if(this.$auth.$storage.getUniversal('user')) {
        this.isAuthor =
        newRes.users_permissions_user.id ===
        this.$auth.$storage.getUniversal('user').id
      }
    },
  },
  async created() {
    const res = await this.$strapi.$notes.findOne(this.$route.params.id)
    this.title = res.title
    this.res = res
    this.content = res.content ? res.content : ''
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
      if (!this.$auth.$storage.getUniversal('user') || (this.$auth.$storage.getUniversal('user').id !== this.res.users_permissions_user.id)) {
        editor.enable(false)
      }
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {
      console.log('editor change!', editor, html, text)
      this.content = html
    },
    imgHandler(handle) {
      this.quill = handle.quill
      console.log(this.$refs)
      const inputfile = this.$refs.input
      inputfile.click()
    },
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
      if(!this.$auth.$storage.getUniversal('user') || (this.res.users_permissions_user.id === this.$auth.$storage.getUniversal('user').id)) {
        const res = await this.$axios.post(
          `http://localhost:1337/upload`,
          formdata
          // config
        )
        // this.isLoading = false
        console.log('res', res)
        // let [line] = this.quill.getLine(10);
        // let index = this.quill.getIndex(line)
        const { index } = this.quill.getSelection()
        
        this.quill.insertEmbed(
          index,
          'image',
          `http://localhost:1337${res.data[0].formats.thumbnail.url}`
        )
        console.log(this.content)
      }
      
    },
    async update() {
      const params = {
        title: this.title,
        // publish_time: this.form.publish_time,
        content: this.content,
        // event_id: this.event_id
      }
      console.log('params', params)
      const res = await this.$strapi.$notes.update(
        this.$route.params.id,
        params
      )
      console.log(res)
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
  },
}
</script>
<style scoped>
.container {
  width: 60%;
  margin: 0 auto;
  padding: 50px 0;
}
.quill-editor {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
