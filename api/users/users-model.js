const db = require("../../data/dbConfig");

module.exports = {
    getAll() {
        return db("users");
    },
    async insert(user) {
        return await db("users").insert(user)
            .then(async id => {
                return await db("users").where("id", id).first();
            });
    },
    getBy(filter) {
        return db("users").where("username", filter).first();
    }

}
