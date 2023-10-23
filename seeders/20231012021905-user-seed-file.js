'use strict'

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs')

const BCRYPT_SALT_ROUNDS = 10
const developerEmail = require('./data/user.json')

const USER_AMOUNT = 3 + developerEmail.length
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS)

    await queryInterface.bulkInsert('Users',
      Array.from({ length: USER_AMOUNT }, (_, index) => {
        if (index < developerEmail.length) {
          return {
            id: index + 1,
            name: developerEmail[index].name,
            account: developerEmail[index].name,
            email: developerEmail[index].email,
            password: bcrypt.hashSync('12345678', salt),
            introduction: 'Hello, I am root',
            is_admin: true,
            avatar: `https://loremflickr.com/300/300/girl/?lock=${index + 1}`,
            had_subscribed: false,
            created_at: new Date(),
            updated_at: new Date()
          }
        } else {
          return {
            id: index + 1,
            name: `user${index}`,
            account: `user${index}`,
            email: `user${index}@example.com`,
            password: bcrypt.hashSync('12345678', salt),
            introduction: `Hello, I am user${index}`,
            is_admin: false,
            avatar: `https://loremflickr.com/300/300/girl/?lock=${index + 1}`,
            had_subscribed: false,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
      }),
      {
        upsertKeys: ['id'],
        updateOnDuplicate: ['name', 'account', 'is_admin', 'email']
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
