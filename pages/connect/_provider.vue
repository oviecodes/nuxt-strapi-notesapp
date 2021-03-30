<template>
  <div>
    <h1>user page</h1>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      provider: this.$route.params.provider,
      access_token: this.$route.query.access_token,
    }
  },
  async mounted() {
    const res = await this.$axios.$get(
      `/auth/${this.provider}/callback?access_token=${this.access_token}`
    )
    console.log('response', res)
    const { jwt, user } = res
    // store jwt and user object in localStorage

    this.$auth.$storage.setUniversal('jwt', jwt)
    this.$auth.$storage.setUniversal('user', { username: user.username, id: user.id, email: user.email })
 
    console.log('cookie user', this.$auth.$storage.getUniversal('user'))
    this.$router.push(`/users/${user.id}`)
  },
}
</script>

<style lang="scss" scoped></style>
