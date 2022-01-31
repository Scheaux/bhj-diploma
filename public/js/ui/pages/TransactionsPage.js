/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element === undefined) throw new Error("Передан пустой элемент");
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render({account_id: this.currentAccount});
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    let confirmFunc = () => {
      this.confirm();
    }

    document.querySelector(".remove-account").removeEventListener("click", confirmFunc);

    document.querySelector(".remove-account").addEventListener("click", confirmFunc);

    // удаление транзакций
    const transactionRemove = document.querySelectorAll(".transaction__remove");
    for (let i = 0; i < transactionRemove.length; i++) {
        transactionRemove[i].addEventListener("click", () => {
        App.getModal("deleteTransaction").open();
        this.removeTransaction(transactionRemove[i].dataset.id);
      });
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    Account.remove(this.currentAccount, (err, response) => {
      if (response.success) {
        this.clear();
        App.updateWidgets();
        new AccountsWidget().update();
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    document.getElementById("send-to-bin").addEventListener("click", () => {
      Transaction.remove(id, (err, response) => {
        if (response.success) {
          this.update();
          new AccountsWidget().update();
        }
      });

      App.getModal("deleteTransaction").close();
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options === undefined) return null;

    this.currentAccount = options.account_id;

    Account.get(options.account_id, (err, response) => {
      this.renderTitle(response.data.name);
    });

    Transaction.list({account_id: options.account_id}, (err, response) => {
      if (response.data.length === 0) {
        this.renderTitle('Название счёта');
      } else if (response.success) {
        document.querySelector(".content").innerHTML = "";
        for (let i = 0; i < response.data.length; i++) {
          this.renderTransactions(response.data[i]);
        }
        this.registerEvents();
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    document.querySelector(".content").innerHTML = "";
    this.renderTitle("Название счёта");
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector(".content-title").innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let fullDate = date.split("-");
    let dayAndHour = fullDate[2].split(" ");
    let month = fullDate[1];
    let hour = dayAndHour[1].split(":")[0];
    let minute = dayAndHour[1].split(":")[1];

    if (month === "01") month = "января";
    else if (month === "02") month = "февраля";
    else if (month === "03") month = "марта";
    else if (month === "04") month = "апреля";
    else if (month === "05") month = "мая";
    else if (month === "06") month = "июня";
    else if (month === "07") month = "июля";
    else if (month === "08") month = "августа";
    else if (month === "09") month = "сентября";
    else if (month === "10") month = "октября";
    else if (month === "11") month = "ноября";
    else if (month === "12") month = "декабря";

    return `${dayAndHour[0]} ${month} ${fullDate[0]} г. в ${hour}:${minute}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
          ${item.sum}<span class="currency"> ₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = document.querySelector(".content");
    const html = this.getTransactionHTML(data);
    content.innerHTML += html;
  }

  confirm() {
    if (document.querySelector(".active.account")) {
      App.getModal("confirmDeletion").open();
    }

    document.getElementById("send-to-void").addEventListener("click", () => {
      this.removeAccount();
      App.getModal("confirmDeletion").close();
    });
  }
}
