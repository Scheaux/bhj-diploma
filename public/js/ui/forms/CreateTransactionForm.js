/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (err, response) => {
      if (response.success) {
        const incomeList = document.getElementById('income-accounts-list');
        const expenseList = document.getElementById('expense-accounts-list');
        
        expenseList.querySelectorAll('option').forEach(item => {
          item.remove();
        });
        incomeList.querySelectorAll('option').forEach(item => {
          item.remove();
        });

        for (let i = 0; i < response.data.length; i++) {
          const id = response.data[i].id;
          const name = response.data[i].name;
          const optionCode = `<option value="${id}">${name}</option>`;
          const option = document.createElement('option');
          option.innerHTML = optionCode;
          let option2 = option.cloneNode(true);
          incomeList.appendChild(option);
          expenseList.appendChild(option2);
        }
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      console.log(data)
      console.log(response)
    })
  }
}