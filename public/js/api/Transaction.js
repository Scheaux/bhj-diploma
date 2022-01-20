/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
class Transaction extends Entity {
  static URL = "/transaction";

  static list(data, callback) {
    createRequest({
      url: this.URL,
      method: 'GET',
      data: {
        id: data
      },
      callback: (err, response) => {
        callback(err, response);
      }
    });
  }
}
