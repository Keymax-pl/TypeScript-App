const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

enum MessageVariant {
  Success = "success",
  Info = "info",
  Error = "error"
}

type InquirerAnswers = {
  action: Action,
}

type User = {
 name: string;
 age: number;
}

class Message {
  constructor(private content: string){}

  public show(): void {
    console.log(this.content);
  }

  public capitalize(): void {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase()
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  static showColorized(variant: MessageVariant, text: string): void {
    if(variant === MessageVariant.Success)consola.success(text)
    if(variant === MessageVariant.Info)consola.info(text)
    if(variant === MessageVariant.Error)consola.error(text)
  }
}

class UsersData {

  data: User[] = [];
  
  public showAll(): void {
    if(this.data.length > 0) {
      consola.info("User data")
      console.table(this.data)
    } else{
       console.info("No data...") 
    }
  }

  public add(user: User): void {
    if(user.age > 0 && user.name.length > 0){
      this.data.push(user);
      Message.showColorized(MessageVariant.Success, "User has been successfully added!");
    } else{
       Message.showColorized(MessageVariant.Error, "Wrong data!") 
    }
  }

  public remove(name: string): void {
    const index = this.data.findIndex(user => user.name === name);
    if(index !== -1){
      this.data.splice(index, 1)
      consola.success("User deleted!")
    } else{
       consola.error("User not found...")
    }
  }
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n")

const startApp = () => {
    inquirer.prompt([{
      name: 'action',
      type: 'input',
      message: 'How can I help you?',
    }]).then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }, {
            name: 'age',
            type: 'number',
            message: 'Enter age',
          }]);
          users.add(user);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }]);
          users.remove(name.name);
          break;
        case Action.Quit:
          Message.showColorized(MessageVariant.Info, "Bye bye!");
          return;
      }
  
      startApp();
    });
  }

  startApp();