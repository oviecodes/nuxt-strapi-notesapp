<template>
    <div>
        <h1>Welcome {{ user.username }}</h1> 
        <button>
            create note
        </button>
        <h3>Your Notes</h3>
        <div v-for="({ name, description }, i) in notes" :key="i">
            <p>{{ name }}</p> 
            <p>{{ description }}</p> 
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user: this.$auth.$storage.getUniversal('user'),
            }
        },
        
        async asyncData({ $auth, $strapi }) {
            const userId = $auth.$storage.getUniversal('user').id
            const notes = await $strapi.$notes.find({ 'users_permissions_user.id': userId })
            return { notes }
        }
    }
</script>

<style lang="scss" scoped>

</style>