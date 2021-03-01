<template>
    <div>
        
        <div class="container cusor-pointer">
            {{ note.title }}
            <div id="toolbar"></div>
            <div
            v-quill:myQuillEditor="editorOption"
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
      editorOption: {
        modules: {
          toolbar: '#toolbar',
        },
      },
    }
  },
  methods: {
    onEditorReady(editor) {
      editor.disable()
    },
    onEditorFocus(editor) {
      editor.disable()
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
#toolbar {
  height: 0;
}
img {
  margin: 0 auto;
}
</style>
