<template>
  <div class="container">
    <div class="container__tabs">
      <a href="#" :class="{ active: activeTabs === 0 }" @click.prevent="setActiveTabs(0)">Пользователи</a>
      <a href="#" :class="{ active: activeTabs === 1 }" @click.prevent="setActiveTabs(1)">API</a>
    </div>
    <div class="container__list" v-if="activeTabs === 0">
      <UsersView />
    </div>
    <div class="container__list" v-if="activeTabs === 1">
      <button class="js-bt" @click="downloadUsers">Скачать файл users.json</button>

      <section>
        <h2>🔗 Доступные эндпоинты:</h2>
        <ul class="json-block">
          <li><code>GET /users</code> — получить список всех пользователей, с их данными и ролями.</li>
          <li><code>GET /roles</code> — получить список всех ролей.</li>
          <li><code>POST /users</code> — добавить нового пользователя (передать имя, email и роль). </li>
          <li><code>GET /download/users</code> — скачать файл с пользователями в формате JSON.</li>
        </ul>
      </section>

      <section>
        <h2>📦 JSON-ответ на <code>GET /users</code>:</h2>
        <pre class="json-block">{{ usersJson }}</pre>
      </section>

      <section>
        <h2>📦 JSON-ответ на <code>GET /roles</code>:</h2>
        <pre class="json-block">{{ rolesJson }}</pre>
      </section>
    </div>
  </div>
</template>

<script>
import UsersView from './views/UsersView.vue'
export default {
  components: {
    UsersView
  },
  mounted () {
    // Восстановление значения activeTabs из sessionStorage
    const savedActiveTabs = sessionStorage.getItem('activeTabs')
    if (savedActiveTabs !== null) {
      this.activeTabs = parseInt(savedActiveTabs)
    } else {
      this.activeTabs = 0 // По умолчанию вкладка "сегодня"
    }
    this.fetchUsersData()
    this.fetchRolesData()
  },
  data () {
    return {
      activeTabs: 0,
      usersJson: '',
      rolesJson: ''
    }
  },
  methods: {
    setActiveTabs (tab) {
      this.activeTabs = tab
      sessionStorage.setItem('activeTabs', tab) // Сохранение вкладки в sessionStorage
    },
    async fetchUsersData () {
      try {
        const response = await fetch('http://localhost:3000/users')
        const data = await response.json()
        this.usersJson = JSON.stringify(data, null, 2)
      } catch (error) {
        console.error('Ошибка при загрузке данных о пользователях:', error)
      }
    },
    async fetchRolesData () {
      try {
        const response = await fetch('http://localhost:3000/roles')
        const data = await response.json()
        this.rolesJson = JSON.stringify(data, null, 2)
      } catch (error) {
        console.error('Ошибка при загрузке данных о пользователях:', error)
      }
    },
    downloadUsers () {
      window.open('http://localhost:3000/download/users')
    }
  }
}
</script>

<style lang="scss">
#app{
  display: flex;
  flex-direction: column;
  height: 100vh;

  .container {
    display: flex;
    flex-direction: column;
    border: 1px solid #e2e2e2;
    background-color: #ffffff;
    gap: 16px;
    width: 1300px;
    margin: auto;
    padding: 0 16px;
    height: 800px;
    overflow-y: auto;

    &__tabs {
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: row;
      padding: 16px 0;
      gap: 32px;
      background-color: #ffffff;
      width: 100%;

      a{
        text-decoration: none;
        color: #666;
        font-size: 16px;
        position: relative;

        &.active {
          color: #00ac00;
        }
      }
    }

    &__list{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;

      h2{
        margin-bottom: 8px;
      }

      .js-bt{
        background-color: #242424;
        color: #fff;
        padding: 4px 12px;
        width: 240px;
      }

      .json-block {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 10px;
        white-space: pre-wrap;
        font-family: monospace;
        font-size: 14px;
      }
    }
  }
}
</style>
