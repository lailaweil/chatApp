const _ = require('lodash');

class Users {

    constructor () {
        this.users = [];
    }
    addUser (id, name, room){
        var user = {id, name , room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        var user = this.getUserById(id);

        if(user){
            this.users = this.users.filter((user)=>{
                return user.id !== id;
            });
        }
        return user;
    }
    getUserById (id) {
        return this.users.filter((user)=>{
            return user.id === id;
        })[0];
    }
    getUserByName (name){
        return this.users.filter((user)=>{
            return user.name === name;
        })[0];
    }
    getUserList (room){
        var users = this.users.filter((user)=>{
            return user.room === room;
        });
        var namesArray = users.map((user)=>{
            return user.name;
        });
        return namesArray;
    }
    getRooms (){
        var rooms = this.users.map((user) =>{
            return user.room;
        });
        return _.uniq(rooms);
    }
}

module.exports = {
    Users
}