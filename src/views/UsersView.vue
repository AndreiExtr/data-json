<template>
  <div>
    <form class="form">
      <input type="text" v-model="newUser.name" placeholder="Имя" />
      <input type="email" v-model="newUser.email" placeholder="Email" />
      <span v-if="emailError" style="color: red">{{ emailError }}</span>
      <select v-model="newUser.roleId">
        <option disabled value="">Выберите роль</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
      <button class="add-bt" @click="submitForm">Добавить</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Email</th>
          <th>Роль</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      users: [],
      roles: [],
      newUser: {
        name: '',
        email: '',
        roleId: ''
      }
    }
  },
  methods: {
    validateEmail () {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.newUser.email) {
        this.emailError = 'Поле обязательно'
        return false
      } else if (!emailPattern.test(this.newUser.email)) {
        this.emailError = 'Некорректный email'
        return false
      } else {
        this.emailError = ''
        return true
      }
    },
    async submitForm () {
      if (!this.newUser.email || !this.newUser.name || !this.newUser.roleId) {
        alert('Заполните все поля!')
        return
      }

      if (!this.validateEmail()) {
        return
      }

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newUser)
      })
      const result = await response.json()
      const role = this.roles.find(r => r.id === result.user.roleId)

      // Добавляется новый пользователь с отображаемой ролью
      this.users.push({
        ...result.user,
        role: role ? role.name : 'Неизвестно'
      })

      // Сброс формы
      this.newUser = { name: '', email: '', roleId: '' }
    }
  },
  async mounted () {
    try {
      const [usersRes, rolesRes] = await Promise.all([ // ждёт, пока оба запроса завершатся, и возвращает массив результатов в виде [usersRes, rolesRes]
        fetch('http://localhost:3000/users'), // запрашивает список пользователей
        fetch('http://localhost:3000/roles') // запрашивает список ролей
      ])

      const usersData = await usersRes.json() // Преобразует ответ usersRes из формата JSON в объект JavaScript
      const rolesData = await rolesRes.json()

      /* Сохраняет полученные данные в свойства компонента users и roles, чтобы потом использовать их в шаблоне (v-for, v-model, и т.п.). */
      this.users = usersData
      this.roles = rolesData
    } catch (error) {
      console.error('Error fetching data', error)
    }
  }
}
</script>

<style lang="scss">
.form{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 24px;

  input,
  select{
    border: 1px solid #c4c4c4;
    padding: 4px 8px;
    width: 270px;
  }

  .add-bt{
    background-color: #00ac00;
    color: #fff;
    padding: 4px 12px;
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

  thead {
    background-color: #242424;
    color: #fff;

    th {
      padding: 12px;
      text-align: left;
      font-weight: bold;
    }
  }

  tbody {
    tr {
      &:nth-child(even) {
        background-color: #f9f9f9;
      }

      &:hover {
        background-color: #ececec;
      }
    }

    td {
      padding: 12px;
      border-top: 1px solid #ddd;
      color: #333;
    }
  }
}
</style>
